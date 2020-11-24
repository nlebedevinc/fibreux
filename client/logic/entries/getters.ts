import { GetterTree } from 'vuex'

import { StateType } from '~/logic/entries/types'
import { RootStateType } from '~/logic/types'

export const getters: GetterTree<StateType, RootStateType> = {
  hasEntries (state): boolean {
    return Boolean(state.entries && state.entries.length > 0)
  },

  activeFilter (state): number {
    return Number(state.activeFilter)
  }
}
