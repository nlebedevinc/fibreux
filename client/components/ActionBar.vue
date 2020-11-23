<template>
  <div :class="$style.actions">
    <button
      :class="$style.reload"
      @click="fetchComments"
      @keypress.enter="fetchComments"
    >
      reload comments
    </button>
  </div>
</template>

<script lang="ts">
import Component from 'nuxt-class-component'
import Vue from 'vue'
import { Action } from 'vuex-class'

import { CommentType } from '~/logic/records/types'
// import TypedStoreMixin from '~/mixins/typed-store'

// @vue/component
@Component({})
/**
 * Stateless component.
 * The primary idea of this component is to illustrate,
 * how `Action`s from typed `Vuex` work.
 */
export default class ActionBar extends Vue {
  @Action('fetchComments')
  /**
   * Typed alias to Vuex `fetchComments` action.
   */
  fetchComments!: () => Promise<CommentType[]>
}
</script>

<style lang="scss" module>
@import '~/scss/variables';

.actions {
  text-align: center;
}

.reload {
  display: inline-block;
  cursor: pointer;
  padding: 5px 10px;
  color: $color-white;
  background-color: $button-color-main;
  border-color: $button-color-main;
}
</style>
