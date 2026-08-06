import { useDateUtils as useDateUtilsBase } from '../../vue/composables/useDateUtils'
import type { IDateOptions } from '../../core/types/date-options.type'
import type { Datetime } from '../../core/types/datetime.type'
import type { Period } from '../../core/types/period.type'
import { DayEnum } from '../../core/enums/day.enum'
import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

/**
 * Nuxt-aware date utils: uses active i18n locale when `localeIso` is omitted.
 */
export function useDateUtils(options?: { localeIso?: string }) {
  const { localeIso: providedLocaleIso } = options ?? {}

  if (providedLocaleIso) {
    return useDateUtilsBase({ localeIso: providedLocaleIso })
  }

  const { currentLocale, getLocaleDateFormat } = useLocale()
  const dateUtils = useDateUtilsBase({ localeIso: currentLocale.value.code })

  function parseDate(dateRef: MaybeRefOrGetter<Datetime>, parseOptions?: IDateOptions) {
    const date = toValue(dateRef)
    const { $i18n } = tryUseNuxtApp() ?? {}
    const locales = toValue($i18n?.locales) ?? []
    const usedLocaleIso = parseOptions?.localeIso ?? currentLocale.value.code
    const usedLocale = locales.find((locale) => locale.code === usedLocaleIso)
    const formatForParse = (usedLocale as { dateFormat?: string })?.dateFormat ?? getLocaleDateFormat(usedLocaleIso)

    return dateUtils.parseDate(date, { ...parseOptions, format: formatForParse })
  }

  function getPeriod(payload: {
    dateRef?: MaybeRefOrGetter<Datetime>
    periodRef?: MaybeRefOrGetter<Period>
    firstDayOfWeek?: DayEnum
    unit?: any
  }) {
    const { dateRef, periodRef, firstDayOfWeek = DayEnum.MONDAY, unit = 'isoWeek' } = payload ?? {}

    return dateUtils.getPeriod({
      date: toValue(dateRef),
      period: toValue(periodRef),
      firstDayOfWeek,
      unit,
    })
  }

  function getExtendedPeriod(payload: {
    dateRef?: MaybeRefOrGetter<Datetime>
    periodRef?: MaybeRefOrGetter<Period>
    firstDayOfWeek?: DayEnum
    minCountOfWeeks?: number
    unit?: any
  }) {
    const { dateRef, periodRef, firstDayOfWeek = DayEnum.MONDAY, minCountOfWeeks = 0, unit = 'isoWeek' } = payload

    return dateUtils.getExtendedPeriod({
      date: toValue(dateRef),
      period: toValue(periodRef),
      firstDayOfWeek,
      minCountOfWeeks,
      unit,
    })
  }

  return {
    ...dateUtils,
    parseDate,
    getPeriod,
    getExtendedPeriod,
  }
}
