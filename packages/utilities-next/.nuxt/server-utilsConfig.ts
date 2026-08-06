import { createDefu } from 'defu'

export const customDefu = createDefu((obj, key, value) => {
  // For arrays, use the value, don't extend
  if (Array.isArray(obj[key])) {
    obj[key] = value ?? obj[key]

    return true
  }
})


  import config0 from '/Users/jk/Projects/crawler/packages/utilities-next/app/config'

export const utilsConfig = customDefu(config0)

export type IIUtilitiesConfig = typeof utilsConfig
export default utilsConfig
