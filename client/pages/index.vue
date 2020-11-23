<template>
  <main :class="$style.main">
    <app-logo />
    <action-bar />

    <section
      v-if="hasComments"
      :class="$style.container"
    >
      <comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </section>
  </main>
</template>

<script lang="ts">
import Component from 'nuxt-class-component'
import Vue from 'vue'
import { Store } from 'vuex'
import { namespace } from 'vuex-class'
// import { useStore } from 'vuex-simple'

import ActionBar from '~/components/ActionBar.vue'
import AppLogo from '~/components/AppLogo.vue'
import Comment from '~/components/Comment.vue'
import { StateType, CommentType, RawCommentType } from '~/logic/records/types'

const comments = namespace('comments')

// @vue/component
@Component({
  'components': {
    ActionBar,
    AppLogo,
    Comment,
  },
})
/**
 * Main page (or index page).
 * Mounted as `/` by default.
 */
export default class Index extends Vue {
  @comments.State('comments')
  comments!: CommentType[]

  @comments.Getter('hasComments')
  hasComments!: boolean
  /**
   * Fetches comments from external API from the server side.
   * This method should preload Vuex store.
   *
   * @see https://nuxtjs.org/api/pages-fetch
   * @param context - Nuxt `context` instance.
   * @param context.store - Current Vuex store.
   * @returns List of downloaded comments.
   */
  fetch({ store }: { store: Store<StateType> }): Promise<RawCommentType[]> {
    // Here we don't have a DI setup yet, so we use the explicit approach:
    // const typedStore = useStore<TypedStore>(store)
    // return typedStore.comments.fetchComments()
    console.log('State', this.comments);
    return store.dispatch(`${comments}/fetchComments`, { 'nick': 'top' })
  }
}
</script>

<style lang="scss" module>
.main {
  max-width: 100%;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>
