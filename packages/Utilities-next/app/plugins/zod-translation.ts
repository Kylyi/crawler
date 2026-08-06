import { translateZodIssue } from '../../core/functions/translate-zod-issue'

export default defineNuxtPlugin(() => {
  z.config({
    customError: translateZodIssue,
  })
})
