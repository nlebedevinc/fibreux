<template>
  <main>
    <div :class="$style.container">
      <div :class="$style.rowt">
    <div :class="$style.navbar">
      <ul>
        <li>
          <pagination
            :currentDate="currentDate"
            :activeFilter="activeFilter"
          />
        </li>
        <li>Total</li>
      </ul>
      <ul v-on:click="onFilter">
        <li><button :class="computedDay" id="1">Day</button></li>
        <li><button :class="computedWeek" id="2">Week</button></li>
        <li><button :class="computedMonth" id="3">Month</button></li>
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

import Pagination from '~/components/Pagination.vue'
import { StateType, EntryType, Filters } from '~/logic/entries/types'

const entries = namespace('entries')

@Component({
  'components': {
    Pagination,
  },
  'middleware': ['auth']
})
export default class Entries extends Vue {
  @entries.State('entries')
  entries!: EntryType[]

  @entries.Getter('hasEntries')
  hasEntries!: boolean

  @entries.Getter('activeFilter')
  activeFilter!: number

  @entries.Getter('currentDate')
  currentDate!: Date

  fetch({ store }: { store: Store<StateType> }): Promise<EntryType[]> {
    return store.dispatch('entries/fetchEntries')
  }

  onFilter(event: Event): void {
    if (event.target.nodeName !== 'BUTTON') {
      return
    }
    this.$store.dispatch('entries/changeFilter', { selected: Number(event.target.id) })

    this.$store.dispatch('entries/fetchEntries', { date: this.currentDate, filter: Number(event.target.id) })
  }

  get computedDay(): Readonly<Record<string, boolean>> {
    return {
      [this.$style['filter-active']]: this.activeFilter === Filters.Day,
    }
  }

  get computedWeek(): Readonly<Record<string, boolean>> {
    console.log('Computed callled')
    return {
      [this.$style['filter-active']]: this.activeFilter === Filters.Week,
    }
  }

  get computedMonth(): Readonly<Record<string, boolean>> {
    return {
      [this.$style['filter-active']]: this.activeFilter === Filters.Month,
    }
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

.filter-active {
  border: 1px solid red
}
</style>
