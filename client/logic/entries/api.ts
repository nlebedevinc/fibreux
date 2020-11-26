import { AxiosInstance } from 'axios'
import { NuxtCookies } from 'cookie-universal-nuxt'
import * as ts from 'io-ts'
import * as tPromise from 'io-ts-promise'

import { Entry, EntryType, Filters, PeriodType } from '~/logic/entries/types'
import { calcPeriod, prepareSpecialistsInvolvedQuery } from '~/logic/utils'

const prepareRequestHeaders = ($cookie: NuxtCookies) => ({
  'Authorization': `Token ${$cookie.get('fibreux')}`,
  'Content-Type': 'application/json',
})

const createRequestBody = (period: PeriodType): any => ([
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
            'q/asc'
          ]
        ],
        'q/limit': 'q/no-limit',
        'q/offset': 0
      },
      'params': {
        '$from': period.from,
        '$to': period.to,
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

export interface InitDataType {
  settingSchemas: object
  projectsConfig: object
  project: string
  error: string | null
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
    payload: { date: Date, filter: number } = { date: new Date(), filter: Filters.Month },
  ): Promise<EntryType[]> {
    try {
      const token = $cookie.get('fibreux')
      const headers = { 'Authorization': `Token ${token}` }
      const body = createRequestBody(calcPeriod(payload.date, payload.filter))

      const response = await $axios.post('/api/commands', body, { headers })
      const result = parseResponse(response.data);

      return tPromise.decode(ts.array(Entry), result)
    } catch (error) {
      return []
    }
  },

  async loadInitData (
    $axios: AxiosInstance,
    $cookie: NuxtCookies,
  ): Promise<Partial<InitDataType>> {
    const query = [{ 'command': 'fibery.schema/query' }]
    const headers = prepareRequestHeaders($cookie)

    let response
    try {
      response = await $axios.post('/api/commands', query, { headers })
      const [ data ] = response.data

      if (data['success']) {
        const { query: specialistQuery, parse } = prepareSpecialistsInvolvedQuery(data['result'])

        response = await $axios.post('/api/commands', specialistQuery, { headers })

        const parsed = parse(response.data)

        const projects = Object.keys(parsed)
        const [project] = projects

        return { settingSchemas: data['result'], projectsConfig: parsed, project, error: null }
      } else {
        return { error: 'Failed to fetch initial commands' }
      }
    } catch (error) {
      console.error(error)
      return { error: 'Initial data fetch error' }
    }
  }
}

export default methods
