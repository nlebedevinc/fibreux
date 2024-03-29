import { GetterTree } from 'vuex'

import { EntryType, StateType, SettingsType } from '~/logic/entries/types'
import { RootStateType } from '~/logic/types'

export const getters: GetterTree<StateType, RootStateType> = {
  hasEntries (state): boolean {
    return Boolean(state.entries && state.entries.length > 0)
  },

  activeFilter (state): number {
    return Number(state.activeFilter)
  },

  currentDate (state): Date {
    return state.activeDate
  },

  selectedEntry (state): EntryType | null {
    return state.selectedEntry
  },

  currentSettings (state): SettingsType {
    return state.settings
  },

  search (state): string {
    console.log(state.search)
    return state.search
  }
}
