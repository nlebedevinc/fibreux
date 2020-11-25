import { ActionTree } from 'vuex'

import entries from '~/logic/entries/api'
import * as reducers from '~/logic/entries/reducers'
import { EntryType, StateType } from '~/logic/entries/types'
import { RootStateType } from '~/logic/types'

export const actions: ActionTree<StateType, RootStateType> = {
  async fetchEntries ({ commit }, payload): Promise<EntryType[]> {
    const list = await entries.fetchEntries(this.$axios, this.$cookies, payload)
    console.log('action', list)
    commit(reducers.SET_ENTRIES, list)
    return list
  },

  login ({ commit }, { token } ): void {
    this.$cookies.set('fibreux', token)
    this.$router.replace({'path': '/entries'})
  },

  logout ({ commit }): void {
    this.$cookies.remove('fibreux')
    this.$router.replace({'path': '/login'})
  },

  changeFilter ({ commit }, { selected }): number {
    console.log('Change filter event', selected)
    commit(reducers.SET_FILTER, selected)
    return selected
  },

  changeDate ({ commit }, { date }): Date {
    console.log(date)
    commit(reducers.SET_DATE, date)
    return date
  },

  selectEntry ({ commit }, entryId: string): void {
    commit(reducers.SET_ENTRY, entryId)
  },

  cleanSelected({ commit }): void {
    commit(reducers.CLEAN_SELECTED)
  }
}
