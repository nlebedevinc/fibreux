<template>
  <main>
    <div :class="$style.container">
      <div :class="$style.rowt">
    <div :class="$style.navbar">
      <ul>
        <li>Pagination here</li>
        <li>Total</li>
      </ul>
      <ul>
        <li><button class="navbar-link">Day</button></li>
        <li><button class="navbar-link">Week</button></li>
        <li><button class="navbar-link">Month</button></li>
      </ul>
    </div>
    <section
      v-if="hasEntries"
      :class="$style.tablentry"
    >
      <table class="">
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

@Component({
  middleware: ['auth']
})
export default class Entries extends Vue {
  @entries.State('entries')
  entries!: EntryType[]

  @entries.Getter('hasEntries')
  hasEntries!: boolean

  @entries.Getter('activeFilter')
  activeFilter!: number

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

.rowt {
  width: 100%;
  padding-left: 96px;
  padding-right: 96px;
}

.navbar {
  display: flex;
  justify-content: space-between;
}

table {
  width: 100%;
}

ul {
  list-style-type: none;
}

td {
  padding-top: 2px;
  padding-bottom: 2px;
}

ul li {
  display: inline;
}

ul li button   {
  background: none;
  border: none;
}

.tablentry {
  border-top: 1px solid rgb(223, 223, 222)
}
</style>
