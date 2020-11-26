import { ActionTree } from 'vuex'

import entries from '~/logic/entries/api'
import * as reducers from '~/logic/entries/reducers'
import { EntryType, StateType } from '~/logic/entries/types'
import { RootStateType } from '~/logic/types'

export const actions: ActionTree<StateType, RootStateType> = {
  async fetchEntries ({ commit }, payload): Promise<EntryType[]> {
    const list = await entries.fetchEntries(this.$axios, this.$cookies, payload)
    commit(reducers.SET_ENTRIES, list)
    return list
  },

  // login
  async login ({ dispatch }, { token } ): Promise<void> {
    this.$cookies.set('fibreux', token)
    const options = await entries.loadInitData(this.$axios, this.$cookies)

    if (options.settingSchemas) {
      dispatch('setSettingsSchemas', options.settingSchemas)
    }

    if (options.projectsConfig) {
      dispatch('setProjectConfig', options.projectsConfig)
    }

    if (options.project) {
      dispatch('setProjectId', options.project)
    }

    this.$router.replace({'path': '/entries'})
  },

  // logout
  logout ({ commit }): void {
    this.$cookies.remove('fibreux')
    this.$router.replace({'path': '/login'})
  },

  changeFilter ({ commit }, { selected }): number {
    commit(reducers.SET_FILTER, selected)
    return selected
  },

  changeDate ({ commit }, { date }): Date {
    commit(reducers.SET_DATE, date)
    return date
  },

  selectEntry ({ commit }, entryId: string): void {
    commit(reducers.SET_ENTRY, entryId)
  },

  cleanSelected({ commit }): void {
    commit(reducers.CLEAN_SELECTED)
  },

  create ({ commit }): void {
    commit(reducers.CREATE_ENTRY)
  },

  // settings
  setSettingsSchemas ({ commit }, schemas): void {
    commit(reducers.SET_SETTINGS_SCHEMAS, schemas)
  },

  setProjectConfig ({ commit }, projectConfig): void {
    commit(reducers.SET_PROJECT_CONFIG, projectConfig)
  },

  setProjectId ({ commit }, project): void {
    commit(reducers.SET_PROJECT_CONFIG, project)
  },

  // store entry
  async saveEntry ({ dispatch }, payload): Promise<void> {
    const { filter, date, settings, record } = payload
    const result = await entries.saveRecord(this.$axios, this.$cookies, { record, settings })

    if (!result.error) {
      dispatch('fetchEntries', { date, filter })
      dispatch('cleanSelected')
    }
  },

  // update
  updateProperty ({ commit }, options): void {
    commit(reducers.UPDATE_PROPERTY, options)
  }
}
