import { ActionTree } from 'vuex'

import comments from '~/logic/records/api'
import * as reducers from '~/logic/records/reducers'
import { RawCommentType, StateType } from '~/logic/records/types'
import { RootStateType } from '~/logic/types'

export const actions: ActionTree<StateType, RootStateType> = {
  async fetchComments ({ commit }, payload): Promise<RawCommentType[]> {
    const commentsList = await comments.fetchComments(this.$axios, payload)
    commit(reducers.SET_COMMENTS, commentsList)
    return commentsList
  },
}
