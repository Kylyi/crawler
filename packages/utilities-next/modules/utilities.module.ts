import { addTemplate, createResolver, defineNuxtModule } from 'nuxt/kit'
import { existsSync, readFileSync } from 'node:fs'

const { resolve } = createResolver(import.meta.url)
const currentDir = resolve('..')

/**
 * Extract `const ComparatorEnum = { ... } as const` blocks from layer configs.
 */
function extractComparatorConst(text: string): string | null {
  const regex = /const\s+ComparatorEnum\s*=\s*\{[\s\S]*?\}\s*as\s*const/g
  const match = text.match(regex)
  return match ? match[0] : null
}

/**
 * Extract `const DataTypeValues = [ ... ] as const` blocks from layer configs.
 */
function extractDataTypeValues(text: string): string[] {
  const regex = /const\s+DataTypeValues\s*=\s*\[([\s\S]*?)\]\s*as\s*const/g
  const match = regex.exec(text)
  if (!match?.[1]) {
    return []
  }

  return match[1]
    .split(',')
    .map((part) => part.replace(/\/\/.*$/gm, '').trim())
    .map((part) => part.replace(/^['"]|['"]$/g, ''))
    .filter((part) => part.length > 0 && !part.startsWith('...'))
}

const CLIENT_UTILS_CONFIG = '#build/client-utilsConfig.ts'
const COMPARATOR_ENUM = '#build/comparator-enum.ts'
const DATA_TYPE = '#build/data-type.type.ts'

function setAliasPaths(
  // Keep loose: Nuxt schema versions can diverge across workspace apps.
  nuxt: any,
  alias: string,
  options: {
    path: string
    server?: boolean
  },
) {
  nuxt.options.typescript.tsConfig ??= {}
  nuxt.options.typescript.tsConfig.compilerOptions ??= {}
  nuxt.options.typescript.tsConfig.compilerOptions.paths ??= {}
  nuxt.options.typescript.tsConfig.compilerOptions.paths[alias] = [options.path]

  if (options.server === false) {
    return
  }

  nuxt.options.nitro ??= {}
  nuxt.options.nitro.typescript ??= {}
  nuxt.options.nitro.typescript.tsConfig ??= {}
  nuxt.options.nitro.typescript.tsConfig.compilerOptions ??= {}
  nuxt.options.nitro.typescript.tsConfig.compilerOptions.paths ??= {}
  nuxt.options.nitro.typescript.tsConfig.compilerOptions.paths[alias] = [options.path]
}

function generateUtilityConfigCode(configPaths: { path: string; isBase: boolean; cwd: string }[]) {
  return `import { createDefu } from 'defu'

export const customDefu = createDefu((obj, key, value) => {
  // For arrays, use the value, don't extend
  if (Array.isArray(obj[key])) {
    obj[key] = value ?? obj[key]

    return true
  }
})


  ${configPaths
    .map(({ path }, idx) => {
      return `import config${idx} from '${path}'`
    })
    .join('\n')}

export const utilsConfig = customDefu(${configPaths.map((_, idx) => `config${idx}`).join(', ')})

export type IIUtilitiesConfig = typeof utilsConfig
export default utilsConfig
`
}

export default defineNuxtModule({
  setup: async (_, nuxt) => {
    console.log('✔ Process Utilities...')

    const configPaths = nuxt.options._layers
      .map((layer) => {
        const isBase = layer.cwd === currentDir
        const configPath = isBase ? 'config' : 'utilities-config'

        return { path: resolve(layer.cwd, 'app', configPath), isBase, cwd: layer.cwd }
      })
      .filter(({ path }) => existsSync(`${path}.ts`))

    const configCode = generateUtilityConfigCode(configPaths)

    addTemplate({
      filename: 'client-utilsConfig.ts',
      write: true,
      getContents: () => configCode,
    })

    addTemplate({
      filename: 'server-utilsConfig.ts',
      write: true,
      getContents: () => configCode,
    })

    setAliasPaths(nuxt, '$utilsConfig', {
      path: './client-utilsConfig.ts',
      server: false,
    })

    // Merge ComparatorEnum const objects into a single export
    const comparatorBlocks = configPaths
      .map(({ path }) => {
        const fileContents = readFileSync(`${path}.ts`, 'utf-8')
        return extractComparatorConst(fileContents)
      })
      .filter((x): x is string => !!x)

    const comparatorContents = comparatorBlocks.length
      ? `${comparatorBlocks.map((block, i) => `const _comparator${i} = ${block.replace(/^const\s+ComparatorEnum\s*=\s*/, '').replace(/\s*as\s*const$/, '')}`).join('\n')}
export const ComparatorEnum = { ${comparatorBlocks.map((_, i) => `..._comparator${i}`).join(', ')} } as const
export type ComparatorEnum = (typeof ComparatorEnum)[keyof typeof ComparatorEnum]
`
      : `export { ComparatorEnum } from '${resolve(currentDir, 'core/enums/comparator.enum')}'
export type { ComparatorEnum as ComparatorEnumType } from '${resolve(currentDir, 'core/enums/comparator.enum')}'
`

    addTemplate({
      filename: 'comparator-enum.ts',
      write: true,
      getContents: () => comparatorContents,
    })

    setAliasPaths(nuxt, '$comparatorEnum', {
      path: './comparator-enum.ts',
    })

    // Merge DataTypeValues
    const dataTypes = configPaths
      .flatMap(({ path }) => {
        const fileContents = readFileSync(`${path}.ts`, 'utf-8')
        return extractDataTypeValues(fileContents)
      })
      .filter((part, index, arr) => arr.indexOf(part) === index)

    const dataTypesCode = dataTypes.length
      ? `
export const DataTypeValues = [
${dataTypes.map((t) => `  '${t}',`).join('\n')}
] as const

export type DataType = (typeof DataTypeValues)[number]
type SimpleDataType = \`\${DataType}Simple\`
export type ExtendedDataType = DataType | SimpleDataType
`
      : `
export { DataTypeValues, type DataType, type ExtendedDataType } from '${resolve(currentDir, 'core/enums/data-type')}'
`

    addTemplate({
      filename: 'data-type.type.ts',
      write: true,
      getContents: () => dataTypesCode,
    })

    setAliasPaths(nuxt, '$dataType', {
      path: './data-type.type.ts',
    })

    nuxt.hook('prepare:types', ({ sharedTsConfig }) => {
      sharedTsConfig.compilerOptions ??= {}
      sharedTsConfig.compilerOptions.paths ??= {}
      sharedTsConfig.compilerOptions.paths.$comparatorEnum = ['./comparator-enum.ts']
      sharedTsConfig.compilerOptions.paths.$dataType = ['./data-type.type.ts']
    })

    nuxt.hook('vite:extendConfig', (config) => {
      if (config.resolve) {
        config.resolve.alias = {
          ...config.resolve.alias,
          $utilsConfig: CLIENT_UTILS_CONFIG,
          $comparatorEnum: COMPARATOR_ENUM,
          $dataType: DATA_TYPE,
        }
      }
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = {
        ...nitroConfig.alias,
        $comparatorEnum: COMPARATOR_ENUM,
        $dataType: DATA_TYPE,
      }
    })
  },
})
