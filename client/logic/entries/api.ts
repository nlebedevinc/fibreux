import { AxiosInstance } from 'axios'
import { NuxtCookies } from 'cookie-universal-nuxt'
import * as ts from 'io-ts'
import * as tPromise from 'io-ts-promise'

import { Entry, EntryType, Filters, PeriodType, SettingsType } from '~/logic/entries/types'
import { calcPeriod, prepareSpecialistsInvolvedQuery } from '~/logic/utils'

const prepareRequestHeaders = ($cookie: NuxtCookies) => ({
  'Authorization': `Token ${$cookie.get('fibreux')}`,
  'Content-Type': 'application/json',
})

export const prepareDeleteRecordQuery = ({ schemas, id, projectConfig, project }): any => {
  const types = schemas['fibery/types'].filter(s => s['fibery/name'].toString().endsWith('Time Entry') && s['fibery/name'].split('/').length === 2);
  const collections = Array.from(new Set(types.map(v => v['fibery/name'])));

  for (const collection of collections) {
    const [projectName] = (collection as string).split('/');

    if (project !== projectName) {
      continue;
    }

    const { collections } = projectConfig[projectName];
    const idField = 'fibery/id';

    if (!id) {
      throw new Error('prepareDeleteRecordQuery can not find ID value');
    }

    const entity = { [idField]: id };

    return [
      {
        'command': 'fibery.entity/delete',
        'args': {
          'type': collections.timeEntries,
          'entity': entity
        },
      },
    ]
  }
}

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
  },

  async saveRecord(
    $axios: AxiosInstance,
    $cookie: NuxtCookies,
    payload: {
      record: EntryType
      settings: SettingsType
    }
  ): Promise<{error: string | null}> {
    let query

    const { record: { id, ticket, time, when, description }, settings } = payload

    if (id) {
      query = [
        {
          'command': 'fibery.entity/update',
          'args': {
            'type': 'Pluto TV/Time Entry',
            'entity': {
              'fibery/id': id,
              'Pluto TV/Ticket Ref': ticket,
              'Pluto TV/Time Spent': time,
              'Pluto TV/When': when,
              'Pluto TV/name': description,
            },
          },
        },
      ]
    } else {
      const { specialist, team, project, partner } = settings

      query = [
        {
          'command': 'fibery.entity/create',
          'args': {
            'type': 'Pluto TV/Time Entry',
            'entity': {
              'Pluto TV/Ticket Ref': ticket,
              'Pluto TV/Project Name': project,
              'Pluto TV/Specialist Name': specialist,
              'Pluto TV/Time Spent': time,
              // Fix this
              'Pluto TV/Meeting Time': ticket!.toString().startsWith('meet') ? '1' : '0',
              'user/Pluto TV Specialist': {
                'fibery/id': specialist,
              },
              'Pluto TV/When': when,
              'user/Pluto TV Team': {
                'fibery/id': team,
              },
              'Pluto TV/Employee Partner Company': (partner && partner !== 'direct') ? {
                'fibery/id': team,
              } : null,
              'Pluto TV/name': description,
            },
          },
        },
      ]
    }

    const headers = prepareRequestHeaders($cookie)
    const response = await $axios.post('/api/commands', query, { headers })

    const [ result ] = response.data
    if (result.success) {
      return { error: null }
    } else {
      console.log(query)
      console.error('Failed to store user', result)
      return { error: 'Failed to store user' }
    }
  },

  async deleteRecord (
    $axios: AxiosInstance,
    $cookie: NuxtCookies,
    payload: {
      record: EntryType
      settings: SettingsType
    }
  ): Promise<{ error: string | null }> {
    const { schemas, projectConfig, project } = payload.settings
    try {
      console.log('PRE QUERY', payload)
      const query = prepareDeleteRecordQuery({ schemas, project, projectConfig, id: payload.record.id })
      const headers = prepareRequestHeaders($cookie)

      console.log(JSON.stringify(query))

      const response = await $axios.post('/api/commands', query, { headers })
      const result = response.data
      if (result.success) {
        return { error: null }
      } else {
        console.log(result)
        throw Error('Invalid response')
      }
    } catch (error) {
      console.log(error)
      return { error: 'Failed to delete record' }
    }
  }

}

export default methods
