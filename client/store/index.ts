// We use default Nuxt index-based store,
// read more about it here:
// https://nuxtjs.org/guide/vuex-store

import { ssrContext as SSRContext } from 'nuxt'
import Vue from 'vue'
import Vuex, { Store, Plugin } from 'vuex'
import ElementUI from 'element-ui'
// import { createVuexStore } from 'vuex-simple'

// import TypedStore from '~/logic/store'
import { RootStateType } from '~/logic/types'
import comments from '~/store/records'
import entries from '~/store/entries'

Vue.use(Vuex)
Vue.use(ElementUI)

// const store: StoreOptions<RootStateType> = {
//   modules: { comments },
// }

/**
 * Creates Vuex.Store to be used and called by Nuxt.
 *
 * We also use this store in tests.
 *
 * @param ssrContext - Is passed via Nuxt, represents current req / res.
 * @param extraContext - Extra options to be used in tests.
 * @param extraContext.plugins - Allows to pass aditional plugin to the store.
 * @returns Global store instance.
 */
export default function store(
  ssrContext: SSRContext,
  extraContext: { plugins: Plugin<RootStateType>[] },
): Store<RootStateType> {
  // const typedStore = new TypedStore()
  return new Store<RootStateType>({
    'modules': {
      'comments': comments,
      'entries': entries,
    },
    'plugins': extraContext ? extraContext.plugins : [],
  })

  // return createVuexStore(typedStore, {
  //   'plugins': extraContext ? extraContext.plugins : [],
  // })
}
