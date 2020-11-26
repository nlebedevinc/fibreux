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

  // settings
  setSettingsSchemas ({ commit }, schemas): void {
    commit(reducers.SET_SETTINGS_SCHEMAS, schemas)
  },

  setProjectConfig ({ commit }, projectConfig): void {
    commit(reducers.SET_PROJECT_CONFIG, projectConfig)
  },

  setProjectId ({ commit }, project): void {
    commit(reducers.SET_PROJECT_ID, project)
  },

  async loadDataAndEntries ({ dispatch }, payload) : Promise<EntryType> {
    const list = await dispatch('fetchEntries', payload)
    await dispatch('initialData')

    return list
  },

  async initialData ({ dispatch }): Promise<void> {
    const options = await entries.loadInitData(this.$axios, this.$cookies)

    if (options.settingSchemas) {
      dispatch('setSettingsSchemas', options.settingSchemas)
    }

    if (options.projectsConfig) {
      dispatch('setProjectConfig', options.projectsConfig)
    }

    console.log('PROJECT', options.project)
    if (options.project) {
      dispatch('setProjectId', options.project)
    }
  },

  // login
  async login ({ dispatch }, { token } ): Promise<void> {
    this.$cookies.set('fibreux', token)
    await dispatch('initialData')

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

  create ({ commit }, entry): void {
    commit(reducers.CREATE_ENTRY, entry)
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
  },

  // delete
  async deleteRecord ({ dispatch }, payload): Promise<void> {
    const { filter, date, settings, record } = payload
    const result = await entries.deleteRecord(this.$axios, this.$cookies, { settings, record })

    if (!result.error) {
      dispatch('fetchEntries', { date, filter })
    }
  }
}
