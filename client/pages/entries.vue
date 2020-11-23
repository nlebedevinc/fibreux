<template>
  <main :class="">
    <section
      v-if="hasEntries"
    >
      <div
        v-for="entry in entries"
        :key="entry.id"
      >Kola</div>
    </section>
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
export default class Entries extends Vue {
  @entries.State('entries')
  entries!: EntryType[]

  @entries.Getter('hasEntries')
  hasEntries!: boolean

  fetch({ store }: { store: Store<StateType> }): Promise<EntryType[]> {
    console.log('State', this.entries)
    return store.dispatch('entries/fetchEntries')
  }
}
</script>

<style lang="scss">
</style>
