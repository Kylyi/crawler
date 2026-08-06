import type { z } from 'zod'
import { getUtilitiesConfig } from '../config/runtime-config'

export const translateZodIssue: z.core.$ZodErrorMap<z.core.$ZodIssue> = (issue) => {
  const $t = getUtilitiesConfig().translate ?? ((key: string) => key)

  let message = issue.message ?? issue.code ?? 'unknown issue'

  switch (issue.code) {
    case 'invalid_type':
      if (issue.input === undefined) {
        message = $t('zod.errors.invalid_type_received_undefined')
      } else {
        message = $t('zod.errors.invalid_type', {
          expected: $t(`zod.types.${issue.expected}`),
          received: $t(`zod.types.${(issue as any).received}`),
        })
      }

      break

    case 'unrecognized_keys':
      message = $t('zod.errors.unrecognized_keys', {
        keys: issue.keys.join(', '),
        count: issue.keys.length,
      })

      break

    case 'invalid_union':
      message = $t('zod.errors.invalid_union')

      break

    case 'invalid_value':
      message = $t('zod.errors.invalid_value', {
        expected: issue.values.join(', '),
        received: issue.input,
      })

      break

    case 'too_big':
      message = $t(`zod.errors.too_big.${issue.origin}.${issue.inclusive ? 'inclusive' : 'exclusive'}`, {
        maximum: issue.maximum,
      })

      break

    case 'too_small':
      message = $t(`zod.errors.too_small.${issue.origin}.${issue.inclusive ? 'inclusive' : 'exclusive'}`, {
        minimum: issue.minimum,
      })

      break

    case 'invalid_format':
      message = $t(`zod.invalid_format.${issue.format}`, {
        validation: issue.format,
        pattern: 'pattern' in issue ? issue.pattern : undefined,
      })

      break

    case 'not_multiple_of':
      message = $t('zod.errors.not_multiple_of', {
        multipleOf: issue.divisor,
      })

      break

    case 'custom':
      message = $t(issue.message ?? 'zod.errors.custom')

      break

    default:
      break
  }

  return { message }
}
