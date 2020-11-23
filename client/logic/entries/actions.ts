import { ActionTree } from 'vuex'

import entries from '~/logic/entries/api'
import * as reducers from '~/logic/entries/reducers'
import { EntryType, StateType } from '~/logic/entries/types'
import { RootStateType } from '~/logic/types'

export const actions: ActionTree<StateType, RootStateType> = {
  async fetchEntries ({ commit }, payload): Promise<EntryType[]> {
    const list = await entries.fetchEntries(this.$axios, payload)
    console.log('action', list)
    commit(reducers.SET_ENTRIES, list)
    return list
  },
}
