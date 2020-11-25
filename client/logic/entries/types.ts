// This is a definition of domain model for `entries` context.

import * as ts from 'io-ts'

// Runtime type, that can be used for schema validation:
export const Entry = ts.type({
  'id': ts.string,
  'description': ts.union([ts.string, ts.null]),
  'person': ts.string,
  'when': ts.union([ts.string, ts.null]),
  'time': ts.union([ts.string, ts.null]),
  'ticket': ts.union([ts.string, ts.null]),
  'project': ts.string,
})

export enum Filters {
  Day = 1,
  Week,
  Month,
}

export const Period = ts.type({
  'from': ts.string,
  'to': ts.string,
})

export type PeriodType = ts.TypeOf<typeof Period>

// Static TypeScript type, that can be used as a regular `type`:
export type EntryType = ts.TypeOf<typeof Entry>

export interface StateType {
  entries: EntryType[]
  activeFilter: number
  activeDate: Date
  selectedEntry: EntryType | null
}
