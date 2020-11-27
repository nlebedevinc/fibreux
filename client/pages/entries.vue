<template>
  <main>
    <div :class="$style.container">
      <div :class="$style.rowt">
        <section>
          <div></div>
          <div>
            <h1>
              <i class="el-icon-s-management"></i>
              Fibreux
            </h1>
            <div>
              <span>
                Track your time - daily progress, tickets in progress and special occasions during your work.
              </span>
              <br/>
              <span>
              Fill entries with associated ticket and capture the data
              </span>
              <p>Click on `View` to filter entries by category</p>
            </div>
          </div>
        </section>
        <section :class="$style.navbar">
          <el-row type="flex" justify="space-between">
            <el-col :span="16">
              <pagination
                :currentDate="currentDate"
                :activeFilter="activeFilter"
              />
            </el-col>
            <el-col :span="8" :class="$style.controls">
              <div style="float: right">
                <el-button size="mini" :class="computedDay" @click="onFilter(1)">Day</el-button>
                <el-button size="mini" :class="computedWeek" @click="onFilter(2)">Week</el-button>
                <el-button size="mini" :class="computedMonth" @click="onFilter(3)">Month</el-button>
                <el-button size="mini" type="primary" @click="onNew">New</el-button>
              </div>
            </el-col>
          </el-row>
        </section>
        <section
          v-if="hasEntries"
          :class="$style.tablentry"
        >
          <el-table :data="doSearch(entries)" class="">
            <el-table-column label="Description" width="">
              <template slot-scope="scope">
                <div v-if="selectedEntry && scope.row.id === selectedEntry.id">
                  <input
                    id="description"
                    placeholder="Type description"
                    :value="selectedEntry.description"
                    @input="updateValue"
                    :class="$style['input-mini']"
                  />
                </div>
                <div v-else>
                  <i class="el-icon-collection-tag"></i>
                  <span style="margin-left: 10px">{{ scope.row.description }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Ticket" width="">
              <template slot-scope="scope">
                <div v-if="selectedEntry && scope.row.id === selectedEntry.id">
                  <input
                    id="ticket"
                    placeholder="Type ticket"
                    :value="selectedEntry.ticket"
                    @input="updateValue"
                    :class="$style['input-mini']"
                  />
                </div>
                <div v-else>
                  <i class="el-icon-tickets"></i>
                  <span style="margin-left: 10px">{{ scope.row.ticket }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Time" width="">
              <template slot-scope="scope">
                <div v-if="selectedEntry && scope.row.id === selectedEntry.id">
                  <input
                    id="time"
                    placeholder="Type time"
                    :value="selectedEntry.time"
                    @input="updateValue"
                    :class="$style['input-mini']"
                  />
                </div>
                <div v-else>
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.time }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="When" width="">
              <template slot-scope="scope">
                <div v-if="selectedEntry && scope.row.id === selectedEntry.id">
              <!-- <input
                id="when"
                placeholder="Type when"
                :value="selectedEntry.when"
                @input="updateValue"
                :class="$style['input-mini']"
              /> -->
                  <el-date-picker
                    v-model="selectedEntry.when"
                    size="mini"
                    type="date"
                    placeholder="Pick a day">
                  </el-date-picker>
                </div>
                <div v-else>
                  <i class="el-icon-date"></i>
                  <span style="margin-left: 10px">{{ scope.row.when }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot="header">
                <el-row>
                  <input
                    :value="search"
                    @input="updateSearch($event)"
                    :class="$style['input-mini']"
                    placeholder="Type to search by description or ticket"/>
                </el-row>
              </template>
              <template slot-scope="scope">
                <div v-if="!selectedEntry || selectedEntry.id !== scope.row.id">
                  <el-button-group>
                    <el-button size="mini" icon="el-icon-edit" @click="onEntrySelect(scope.row.id)"/>
                    <el-button size="mini" icon="el-icon-document-copy" @click="onCopy(scope.row)"/>
                    <el-button size="mini" icon="el-icon-delete" type="danger" @click="onEntryDelete(scope.row)"/>
                  </el-button-group>
                </div>
                <div v-else>
                  <el-button-group>
                    <el-button size="mini" type="primary" icon="el-icon-circle-check" @click="onSave(selectedEntry)"/>
                    <el-button size="mini" type="danger" icon="el-icon-circle-close" @click="cleanSelected" />
                  </el-button-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
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
import { StateType, EntryType, Filters, SettingsType } from '~/logic/entries/types'
import { Button, ButtonGroup, Table, TableColumn, Input, Row, DatePicker, Col } from 'element-ui'

const entries = namespace('entries')

@Component({
  'components': {
    Pagination,
    Button,
    Table,
    TableColumn,
    Input,
    ButtonGroup,
    Row,
    DatePicker,
    Col,
  },
  'middleware': ['auth'],
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

  @entries.Getter('currentSettings')
  settings!: SettingsType

  @entries.Getter('search')
  search!: string

  fetch({ store }: { store: Store<StateType> }): Promise<EntryType[]> {
    return store.dispatch('entries/loadDataAndEntries')
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

  onCopy(entry: EntryType): void {
    if (!this.selectedEntry) {
      this.$store.dispatch('entries/create', entry)
    }
  }

  onSave(entry): void {
    console.log("Entry to save", entry)
    this.$store.dispatch('entries/saveEntry', { record: entry, settings: this.settings, date: this.currentDate, filter: this.activeFilter })
  }

  onEntryDelete(entry): void {
    this.$store.dispatch('entries/deleteRecord', { record: entry, settings: this.settings, date: this.currentDate, filter: this.activeFilter })
  }

  updateValue(event): void {

    const field = event.target.id
    const value = event.target.value

    console.log({ field, value })

    this.$store.dispatch('entries/updateProperty', { field, value })
  }

  updateSearch(event): void {
    const value = event.target.value
    this.$store.dispatch('entries/updateSearch', { value })
  }

  doSearch(entries: EntryType[]): EntryType[] {
    const filter = ((entry: EntryType) => {
      if (!this.search) {
        return true
      }

      const byDescription = entry.description!.toLowerCase().includes(this.search.toLowerCase())
      const byTicket = entry.ticket!.toLowerCase().includes(this.search.toLowerCase())

      return byDescription || byTicket
    })
    return entries.filter(filter)
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

.controls {
}

ul {
  list-style-type: none;
  margin-bottom: 0px;
}

ul li {
  display: inline;
}

.tablentry {
  border-top: 1px solid rgb(223, 223, 222)
}

.filter-active {
  border: 1px solid red
}

.input-mini {
  font-size: 12px;
  height: 28px;
  line-height: 28px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 15px;
  padding-right: 15px;
  color: #606266;
  width: 100%;
  outline: 0
}

.input-mini:focus {
  border-color: #409EFF;
  outline: 0
}
</style>
