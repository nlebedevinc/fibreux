import { MutationTree } from 'vuex'

import * as reducers from '~/logic/entries/reducers'

import { EntryType, StateType } from '~/logic/entries/types'

export const mutations: MutationTree<StateType> = {
  [reducers.SET_ENTRIES]: (
    state,
    entries: EntryType[],
  ): void => {
    const updatedEntries: EntryType[] = []

    for (const entry of entries) {
      entry.description = entry.description || ''
      entry.ticket = entry.ticket || ''
      entry.time = entry.time || ''
      entry.when = entry.when || ''
      updatedEntries.push(entry)
    }

    state.entries = updatedEntries
  },

  [reducers.SET_FILTER]: (
    state,
    selected: number,
  ): void => {
    state.activeFilter = selected
  },

  [reducers.SET_DATE]: (
    state,
    date: Date,
  ): void => {
    state.activeDate = new Date(date)
  },

  [reducers.SET_ENTRY]: (
    state,
    entryId: string
  ): void => {
    for (const entry of state.entries) {
      if (entry.id === entryId) {
        state.selectedEntry = entry
        break
      }
    }
  },

  [reducers.CLEAN_SELECTED]: (
    state,
  ): void => {
    const index = state.entries.findIndex(entry => !entry.id)
    if (index > -1) {
      state.entries.splice(index, 1)
    }
    state.selectedEntry = null
  },

  [reducers.CREATE_ENTRY]: (
    state,
    payload,
  ): void => {
    const entry: EntryType = {
      'id': null,
      'description': (payload && payload.description) || '',
      'person': (payload && payload.person) || '',
      'project': (payload && payload.project) || '',
      'ticket': (payload && payload.ticket) || '',
      'time': (payload && payload.time) || '',
      'when': (payload && payload.when) || '',
    }

    state.entries.push(entry)
    state.selectedEntry = entry
  },

  [reducers.SET_SETTINGS_SCHEMAS]: (
    state,
    schemas: any,
  ): void => {
    state.settings = {
      ...state.settings,
      schemas,
    }
  },

  [reducers.SET_PROJECT_CONFIG]: (
    state,
    projectConfig: any,
  ): void => {
    state.settings = {
      ...state.settings,
      projectConfig,
    }
  },

  [reducers.SET_PROJECT_ID]: (
    state,
    project,
  ): void => {
    const { team, specialist, partner } = state.settings.projectConfig[project]

    state.settings = {
      ...state.settings,
      project,
      team,
      specialist,
      partner,
    }
  },

  [reducers.UPDATE_PROPERTY]: (
    state,
    { field, value }
  ): void => {
    state.selectedEntry = {
      ...state.selectedEntry,
      [field]: value,
    } as EntryType
  }
}
