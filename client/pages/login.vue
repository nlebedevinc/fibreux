<template>
  <main>
    <div :class="$style.container">
      <form action="">
        <input class="u-full-width" type="text" placeholder="Fibery token" id="token">
        <input class="button-primary" type="submit" value="Submit">
      </form>
    </div>
  </main>
</template>

<script lang="ts">
import Component from 'nuxt-class-component'
import Vue from 'vue'
import { Store } from 'vuex'
import { namespace } from 'vuex-class'

import { StateType, EntryType } from '~/logic/entries/types'

const entries = namespace('entries')

@Component({})
export default class Login extends Vue {

  login({ store }: { store: Store<StateType>}): Promise<void> {
    return store.dispatch('entries/login', )
  }

  fetch({ store }: { store: Store<StateType> }): Promise<EntryType[]> {
    return store.dispatch('entries/fetchEntries')
  }
}
</script>

<style lang="scss" module >
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row {
  padding-left: 96px;
  padding-right: 96px;
}
</style>
