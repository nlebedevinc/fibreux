import { Filters, PeriodType } from '~/logic/entries/types'

export function toPeriod(date: Date): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

export function calcPeriod(date: Date, filter: number): PeriodType {
  let from: Date;
  let to: Date;
  switch(filter) {
    case Filters.Month:
      from = new Date(date.getFullYear(), date.getMonth(), 1);
      to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      break
    case Filters.Week:
      const first = date.getDate() - date.getDay()
      const last = first + 6
      from = new Date(date.setDate(first))
      to = new Date(date.setDate(last))
      break
    case Filters.Day:
      from = new Date(date)
      to = new Date(date)
      break
    default:
      from = new Date(date)
      to = new Date(date)
      break
  }

  return { from: toPeriod(from), to: toPeriod(to) }
}
