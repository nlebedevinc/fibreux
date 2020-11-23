import { actions } from '~/logic/records/actions'
import { getters } from '~/logic/records/getters'
import { mutations } from '~/logic/records/mutations'
import { state } from '~/logic/records/state'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
