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
  }
}
