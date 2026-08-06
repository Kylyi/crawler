import type { ManipulateType, OpUnitType } from 'dayjs'

// Types
import type { Datetime } from '../../core/types/datetime.type'
import type { IDateOptions } from '../../core/types/date-options.type'
import type { Period } from '../../core/types/period.type'
import type { DateFormatPreset } from '../../core/types/date-format-preset.type'

// Models
import { Day } from '../../core/models/day.model'
import { DayEnum } from '../../core/enums/day.enum'

// Functions
import { removeDatetimeSpaces } from '../../core/functions/remove-datetime-spaces'

// Constants
import { datetimeFormats } from '../../core/i18n/index'
import { $date } from '../../core/utils/$date'
import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export type IExtendedPeriodOptions = {
  unit?: OpUnitType | ManipulateType | 'isoWeek'
  firstDayOfWeek?: DayEnum
  minCountOfWeeks?: number
  period?: Period
  date?: Datetime
}

export type IExtendedPeriodOptionsApp = {
  unit?: OpUnitType | ManipulateType | 'isoWeek'
  firstDayOfWeek?: DayEnum
  minCountOfWeeks?: number
  periodRef?: MaybeRefOrGetter<Period>
  dateRef?: MaybeRefOrGetter<Datetime>
}

function createDateUtils(localeIso: string) {
  const localeUses24HourTime = () => {
    return (
      new Intl.DateTimeFormat(localeIso, { hour: 'numeric' })
        .formatToParts(new Date(2020, 0, 1, 13))
        .find((part) => part.type === 'hour')?.value.length === 2
    )
  }

  const formatDate = (dateRef?: MaybeRefOrGetter<Datetime>, options: IDateOptions | DateFormatPreset = 'short') => {
    let date = toValue(dateRef)

    if (typeof date === 'string') {
      date = date.trim()
    }

    // When using a predefined format, we use the corresponding Intl API
    if (typeof options === 'string') {
      const parsedDate = parseDate(date)

      if (!parsedDate.isValid()) {
        return ''
      }

      const isPredefinedFormat = datetimeFormats[options]

      if (isPredefinedFormat) {
        return Intl.DateTimeFormat(localeIso, datetimeFormats[options])
          .format(parsedDate.valueOf())
          .replace(/(\d{2})\.\s(\d{2})\.\s(\d{4})/g, '$1.$2.$3')
      } else {
        return parsedDate.format(options).replace(/(\d{2})\.\s(\d{2})\.\s(\d{4})/g, '$1.$2.$3')
      }
    }

    // Otherwise we use the Intl API
    else {
      const { outputIntlOptions } = options
      const usedLocaleIso = options?.localeIso ?? localeIso
      const parsedDate = parseDate(date, options)

      if (!parsedDate.isValid()) {
        return ''
      }

      // When using a predefined format, we use the corresponding Intl API
      if (typeof outputIntlOptions === 'string' && datetimeFormats[outputIntlOptions]) {
        const formattedDate = Intl.DateTimeFormat(usedLocaleIso, datetimeFormats[outputIntlOptions]).format(
          parsedDate.valueOf(),
        )

        return options?.removeSpaces ? removeDatetimeSpaces(formattedDate) : formattedDate
      }

      // When using an explicit format, we use the dayjs API
      else if (typeof outputIntlOptions === 'string') {
        return parsedDate.format(outputIntlOptions)
      }

      const formattedDate = Intl.DateTimeFormat(usedLocaleIso, outputIntlOptions).format(parsedDate.valueOf())

      return options?.removeSpaces ? removeDatetimeSpaces(formattedDate) : formattedDate
    }
  }

  const formatTime = (
    timeRef: MaybeRefOrGetter<string>,
    options: {
      appendString?: string
    } = {},
  ) => {
    const time = toValue(timeRef)
    const { appendString = '' } = options

    return formatDate(`2020-01-01 ${time} ${appendString}`, { outputIntlOptions: 'time' })
  }

  const parseDate = (dateRef: MaybeRefOrGetter<Datetime>, options?: IDateOptions) => {
    const date = toValue(dateRef)

    return options?.isLocalString ? $date(date, options?.format) : $date(date)
  }

  const getPeriod = (payload: IExtendedPeriodOptions = {}): Period => {
    const {
      date,
      period,
      firstDayOfWeek = DayEnum.MONDAY,
      unit = 'isoWeek' as ManipulateType,
    } = payload

    const periodStart = period?.periodStart || date
    let periodStartObj = $date(periodStart)?.startOf(unit)

    if (unit === 'isoWeek' || unit.startsWith('w')) {
      const firstDayOfWeekIdx = periodStartObj.day() < firstDayOfWeek ? firstDayOfWeek - 7 : firstDayOfWeek

      periodStartObj = periodStartObj.day(firstDayOfWeekIdx)
    }

    return {
      periodStart: periodStartObj,
      periodEnd: periodStartObj.add(1, unit as ManipulateType).subtract(1),
    }
  }

  const getExtendedPeriod = (payload: IExtendedPeriodOptions = {}): Period => {
    const {
      date,
      period,
      firstDayOfWeek = DayEnum.MONDAY,
      unit = 'isoWeek' as ManipulateType,
      minCountOfWeeks: minCountOfWeeksArg = 6,
    } = payload

    const periodStart = period?.periodStart || date
    const periodEnd = period?.periodEnd || date

    const periodStartObj = $date(periodStart)?.startOf(unit)
    const periodEndObj = $date(periodEnd)?.endOf(unit)

    const periodStartExtendedDayIdx = periodStartObj.day() < firstDayOfWeek ? firstDayOfWeek - 7 : firstDayOfWeek
    const periodStartExtended = periodStartObj.day(periodStartExtendedDayIdx)
    let periodEndExtended = periodEndObj.day() ? periodEndObj.day(7) : periodEndObj
    const diff = periodEndExtended.diff(periodStartExtended, 'day')

    const minCountOfWeeks = Math.max(minCountOfWeeksArg, Math.ceil(diff / 7))
    periodEndExtended = periodEndExtended.add(minCountOfWeeks * 7 - 1 - diff, 'day')

    return { periodStart: periodStartExtended, periodEnd: periodEndExtended }
  }

  const getDaysInPeriod = (
    periodRef: MaybeRefOrGetter<Period>,
    options: { excludedDays?: DayEnum[]; currentPeriod?: Period; utc?: boolean } = {},
  ) => {
    const period = toValue(periodRef)
    const { excludedDays, currentPeriod, utc } = options
    const days: Day[] = []
    let current = period.periodStart

    while (current.isSameOrBefore(period.periodEnd)) {
      const day = new Day(current, currentPeriod || period, { useUtc: utc })

      if (!excludedDays?.includes(day.dayOfWeek)) {
        days.push(day)
      }

      current = current.add(1, 'day')
    }

    return days
  }

  /**
   * Checks if the given `from` and `to` dates make sense ~ `fromRef` must be
   * before `toRef` and both must be before the current date.
   */
  const isValidRange = (fromRef: MaybeRefOrGetter<Datetime>, toRef?: MaybeRefOrGetter<Datetime>) => {
    const from = toValue(fromRef)
    const to = toValue(toRef)

    // If no `to` date is provided, we assume that the `from` date is valid
    if (!to) {
      return true
    }

    return $date(from).isSameOrBefore($date(to))
  }

  return {
    localeUses24HourTime,
    getExtendedPeriod,
    getDaysInPeriod,
    getPeriod,
    formatDate,
    formatTime,
    parseDate,
    isValidRange,
  }
}

/**
 * Works the same way as `.valueOf()` but ignores the time part of the date
 */
export function getDateSimpleValue(dateRef: MaybeRefOrGetter<Datetime>) {
  const date = toValue(dateRef)

  return $date(date).startOf('day').valueOf()
}

/**
 * Framework-agnostic date utils. Pass `localeIso` for locale-aware formatting.
 * Defaults to `en-US`. Nuxt apps that need cookie/i18n locale should use the
 * layer wrapper in `app/composables/useDateUtils.ts`.
 */
export function useDateUtils(options?: { localeIso?: string }) {
  return createDateUtils(options?.localeIso ?? 'en-US')
}
