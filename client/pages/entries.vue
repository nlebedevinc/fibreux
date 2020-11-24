<template>
  <main>
    <div :class="$style.container">
    <section
      v-if="hasEntries"
      class="row"
    >
      <table class="u-full-width">
        <thead>
          <tr>
            <th>Description</th>
            <th>Ticket</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in entries"
            :key="entry.id"
          >
            <td>{{ entry.description }}</td>
            <td>{{ entry.ticket }}</td>
            <td>{{ entry.time }}</td>
            <td>{{ entry.when }}</td>
          </tr>
        </tbody>
      </table>
    </section>
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
