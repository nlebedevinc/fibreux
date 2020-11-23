import { AxiosInstance } from 'axios'
import * as ts from 'io-ts'
import * as tPromise from 'io-ts-promise'

import { Entry, EntryType } from '~/logic/entries/types'

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
    payload: { nick: string }
  ): Promise<EntryType[]> {
    const raw = [
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
            'q/limit': 100,
            'q/offset': 0
          },
          'params': {
            '$from': '2020-10-20',
            '$to': '2020-11-20'
          }
        }
      }
    ]

    const headers = { 'Authorization': 'Token 919de886.2ad6ae3beba581dc84144d35adfc5958872' }

    const response = await $axios.post('/api/commands', raw, { headers })

    console.log(response.data);

    return tPromise.decode(ts.array(Entry), [{ id: '1' }, { id: '2'}, { id: '3' }])
  },
}

export default methods
