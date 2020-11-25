import { StateType, Filters } from '~/logic/entries/types'

export const state = (): StateType => ({
  'entries': [],
  'activeFilter': Filters.Month,
  'activeDate': new Date(),
})
