import { GetterTree } from 'vuex'

import { StateType } from '~/logic/records/types'
import { RootStateType } from '~/logic/types'


export const getters: GetterTree<StateType, RootStateType> = {
  hasComments (state): boolean {
    return Boolean(state.comments && state.comments.length > 0)
  },
}
