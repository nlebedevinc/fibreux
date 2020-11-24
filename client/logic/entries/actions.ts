import { ActionTree } from 'vuex'

import entries from '~/logic/entries/api'
import * as reducers from '~/logic/entries/reducers'
import { EntryType, StateType } from '~/logic/entries/types'
import { RootStateType } from '~/logic/types'

export const actions: ActionTree<StateType, RootStateType> = {
  async fetchEntries ({ commit }, payload): Promise<EntryType[]> {
    const list = await entries.fetchEntries(this.$axios, this.$cookies)
    console.log('action', list)
    commit(reducers.SET_ENTRIES, list)
    return list
  },

  async login ({ commit }, { token } ): Promise<void> {
    this.$cookies.set('fibreux', token)
    this.$router.replace({'path': '/entries'})
  }
}
