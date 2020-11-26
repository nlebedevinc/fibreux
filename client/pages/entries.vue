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
      <div>
        <ul>
          <li><button :class="computedDay" @click="onFilter(1)">Day</button></li>
          <li><button :class="computedWeek" @click="onFilter(2)">Week</button></li>
          <li><button :class="computedMonth" @click="onFilter(3)">Month</button></li>
        </ul>
        <button @click="onNew">New</button>
      </div>
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
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in entries"
            :key="entry.id"
          >
            <td>
              <input v-if="selectedEntry && entry.id === selectedEntry.id" :value="selectedEntry.description">
              <span v-else>{{ entry.description }}</span>
            </td>
            <td>
              <input v-if="selectedEntry && entry.id === selectedEntry.id" :value="selectedEntry.ticket">
              <span v-else>{{ entry.ticket }}</span>
            </td>
            <td>
               <input v-if="selectedEntry && entry.id === selectedEntry.id" :value="selectedEntry.time">
              <span v-else>{{ entry.time }}</span>
            </td>
            <td>
              <input v-if="selectedEntry && entry.id === selectedEntry.id" :value="selectedEntry.when">
              <span v-else>{{ entry.when }}</span>
            </td>
            <td>
              <ul v-if="!selectedEntry">
                <li>
                  <button>Copy</button>
                </li>
                <li>
                  <button @click="onEntrySelect(entry.id)">Edit</button>
                </li>
                <li>
                  <button>Delete</button>
                </li>
              </ul>
              <ul v-else>
                <li>
                  <button>Save</button>
                </li>
                <li>
                  <button @click="cleanSelected">Cancel</button>
                </li>
              </ul>
            </td>
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

  @entries.Getter('selectedEntry')
  selectedEntry!: EntryType

  fetch({ store }: { store: Store<StateType> }): Promise<EntryType[]> {
    return store.dispatch('entries/fetchEntries')
  }

  onFilter(filter: number): void {
    if (this.activeFilter === filter) {
      return
    }
    this.$store.dispatch('entries/changeFilter', { selected: Number(filter) })

    this.$store.dispatch('entries/fetchEntries', { date: this.currentDate, filter: Number(filter) })
  }

  onEntrySelect(entryId: string | null): void {
    this.$store.dispatch('entries/selectEntry', entryId)
  }

  cleanSelected(): void {
    this.$store.dispatch('entries/cleanSelected')
  }

  onNew(): void {
    if (!this.selectedEntry) {
      this.$store.dispatch('entries/create')
    }
  }

  get computedDay(): Readonly<Record<string, boolean>> {
    return {
      [this.$style['filter-active']]: this.activeFilter === Filters.Day,
    }
  }

  get computedWeek(): Readonly<Record<string, boolean>> {
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
  margin-bottom: 0px;
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

button {
  margin-bottom: 0;
  padding: 0;
  height: 12px;
  line-height: 12px;
}
</style>
