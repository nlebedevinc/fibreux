// This is a definition of domain model for `entries` context.

import * as ts from 'io-ts'

// Runtime type, that can be used for schema validation:
export const Entry = ts.type({
  'id': ts.string,
})

// Static TypeScript type, that can be used as a regular `type`:
export type EntryType = ts.TypeOf<typeof Entry>

export interface StateType {
  entries: EntryType[]
}
