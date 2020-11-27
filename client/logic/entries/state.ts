import { StateType, Filters } from '~/logic/entries/types'

export const state = (): StateType => ({
  'entries': [],
  'activeFilter': Filters.Month,
  'activeDate': new Date(),
  'selectedEntry': null,
  'search': '',
  'settings': {
    team: '',
    specialist: '',
    partner: '',
    project: '',
    projectConfig: null,
    schemas: null,
  }
})
