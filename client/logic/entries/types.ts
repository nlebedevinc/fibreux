// This is a definition of domain model for `entries` context.

import * as ts from 'io-ts'

export interface TimeType {
  hours: number
  minutes: number
  seconds: number
}

// Runtime type, that can be used for schema validation:
export const Entry = ts.type({
  'id': ts.union([ts.string, ts.null]),
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

// export interface EntryType {
//   'id': string | null
//   'description': string | null
//   'person': string
//   'when': string | null,
//   'time': TimeType,
//   'ticket': string | null,
//   'project': string,
// }

export interface ProjectType {
  id: string
  name: string
}
export interface SettingsType {
  team: string,
  specialist: string,
  partner: string,
  project: string,
  projectConfig: any,
  schemas: any,
}

export interface StateType {
  entries: EntryType[]
  activeFilter: number
  activeDate: Date
  selectedEntry: EntryType | null
  settings: SettingsType
  search: string
}
