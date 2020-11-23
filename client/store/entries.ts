import { actions } from '~/logic/entries/actions'
import { getters } from '~/logic/entries/getters'
import { mutations } from '~/logic/entries/mutations'
import { state } from '~/logic/entries/state'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
