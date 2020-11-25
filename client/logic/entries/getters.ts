import { GetterTree } from 'vuex'

import { EntryType, StateType } from '~/logic/entries/types'
import { RootStateType } from '~/logic/types'

export const getters: GetterTree<StateType, RootStateType> = {
  hasEntries (state): boolean {
    return Boolean(state.entries && state.entries.length > 0)
  },

  activeFilter (state): number {
    console.log('Getter was called')
    return Number(state.activeFilter)
  },

  currentDate (state): Date {
    return state.activeDate
  },

  selectedEntry (state): EntryType | null {
    return state.selectedEntry
  },
}
