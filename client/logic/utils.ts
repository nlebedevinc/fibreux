import { Filters } from '~/logic/entries/types'

export function toPeriod(date: Date): string {
  let day = date.getUTCDate()
  let month = date.getUTCMonth() + 1
  let year = date.getUTCFullYear()

  return `${year}-${month}-${day}`
}

export function calcPeriod(date: Date, filter: number) {

  let from: Date;
  let to: Date;
  switch(filter) {
    case Filters.Month:
      from = new Date(date.getFullYear(), date.getMonth(), 1);
      to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      break
    case Filters.Week:
      let first = date.getDate() - date.getDay()
      let last = first + 6
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
