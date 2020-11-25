import { AxiosInstance } from 'axios'
import { NuxtCookies } from 'cookie-universal-nuxt'
import { Store } from 'vuex'
import * as ts from 'io-ts'
import * as tPromise from 'io-ts-promise'

import { Entry, EntryType } from '~/logic/entries/types'
import { RootStateType } from '../types'

const createRequestBody = (): any => ([
  {
    'command': 'fibery.entity/query',
    'args': {
      'query': {
        'q/from': 'Pluto TV/Time Entry',
        'q/select': {
          'id': 'fibery/id',
          'ticket': 'Pluto TV/Ticket Ref',
          'project': 'Pluto TV/Project Name',
          'person': 'Pluto TV/Specialist Name',
          'time': 'Pluto TV/Time Spent',
          'when': 'Pluto TV/When',
          'description': 'Pluto TV/name',
          'updatedAt': 'fibery/modification-date',
          'createdAt': 'fibery/creation-date'
        },
        'q/where': [
          'and',
          [
            '=',
            [
              'fibery/created-by',
              'fibery/id'
            ],
            '$my-id'
          ],
          [
            '>=',
            [
              'Pluto TV/When'
            ],
            '$from'
          ],
          [
            '<=',
            [
              'Pluto TV/When'
            ],
            '$to'
          ]
        ],
        'q/order-by': [
          [
            [
              'Pluto TV/When'
            ],
            'q/desc'
          ]
        ],
        'q/limit': 'q/no-limit',
        'q/offset': 0
      },
      'params': {
        '$from': '2020-10-20',
        '$to': '2020-11-20'
      }
    }
  }
])

const parseResponse = (data: any): any => {
  if (!Array.isArray(data) || !data[0]) {
    return [];
  }

  return data[0].result
}

const methods = {
  /**
   * Fetches comments from the remote API.
   *
   * @param $axios - Slightly modified `Axios` instance from nuxt-axios module.
   * @param payload - Some.
   * @returns Parsed response data.
   */
  async fetchEntries (
    $axios: AxiosInstance,
    $cookie: NuxtCookies,
    $store: Store<RootStateType>,
  ): Promise<EntryType[]> {
    try {
      const token = $cookie.get('fibreux')
      const headers = { 'Authorization': `Token ${token}` }
      const body = createRequestBody();

      const response = await $axios.post('/api/commands', body, { headers })
      const result = parseResponse(response.data);

      return tPromise.decode(ts.array(Entry), result)
    } catch (error) {
      // if (error.response.status === 401) {
      //   $store.dispatch('entries/logout')
      // }

      return []
    }
  },
}

export default methods
