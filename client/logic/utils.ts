import { Filters, PeriodType } from '~/logic/entries/types'

export function toPeriod(date: Date): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

export function calcPeriod(date: Date, filter: number): PeriodType {
  let from: Date;
  let to: Date;
  switch(filter) {
    case Filters.Month:
      from = new Date(date.getFullYear(), date.getMonth(), 1);
      to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      break
    case Filters.Week:
      const first = date.getDate() - date.getDay()
      const last = first + 6
      from = new Date(date.setDate(first))
      to = new Date(date.setDate(last))
      break
    case Filters.Day:
      from = new Date(date)
      to = new Date(date)
      break
    default:
      from = new Date(date)
      to = new Date(date)
      break
  }

  return { from: toPeriod(from), to: toPeriod(to) }
}

export const parseSpecialistsInvolvedQueryResult = (mappings) => (response) => {
  const parsed = {};

  for (let i = 0; i < mappings.length; i++) {
    const { specialists, timeEntries } = mappings[i].collections
    const { project, fields } = mappings[i]
    const { success, result } = response[i]
    const [item] = result;

    if (!success) {
      console.error('command error: parseSpecialistsInvolvedQueryResult', item)
      continue;
    }

    if (!result.length) {
      continue;
    }

    if (result.length > 1) {
      console.error('more that 1 record: parseSpecialistsInvolvedQueryResult', item)
      continue;
    }

    parsed[project] = {
      specialist: item[fields.id],
      name: item[fields.name],
      collections: {
        specialists: specialists.find(s => s.startsWith(project)),
        timeEntries: timeEntries.find(s => s.startsWith(project)),
      },
    };

    if (fields.partner && item[fields.partner]) {
      parsed[project].partner = item[fields.partner]['fibery/id']
    }

    if (fields.team && item[fields.team]) {
      parsed[project].team = item[fields.team]['fibery/id']
    }
  }

  return parsed
}

export const prepareSpecialistsInvolvedQuery = (schemas) => {
  const specialistTypes = schemas['fibery/types'].filter(s => s['fibery/name'].toString().endsWith('Specialist') && !s['fibery/name'].toString().includes('_'));
  const specialistCollections = Array.from(new Set(specialistTypes.map(v => v['fibery/name'])));

  const timeEntriesTypes = schemas['fibery/types'].filter(s => s['fibery/name'].toString().endsWith('Time Entry') && s['fibery/name'].split('/').length === 2);
  const timeEntriesCollections = Array.from(new Set(timeEntriesTypes.map(v => v['fibery/name'])));

  const getPartner = (fields) => {
    const found = fields.find(v => v['fibery/name'].endsWith('Employee Partner Company'));
    return found && found['fibery/name'];
  };

  const getName = (fields) => {
    const found = fields.find(v => /name$/i.test(v['fibery/name']));
    return found && found['fibery/name'];
  };

  const getTeam = (fields) => {
    const found = fields.find(v => v['fibery/name'].includes('Team'));
    return found && found['fibery/name'];
  };

  const query: Array<{ command: string, args: object }> = [];
  const mappings: Array<{ project: string, fields: object, collections: object }> = [];
  for (const collection of specialistCollections) {
    const [projectName] = (collection as string).split('/');

    if (projectName === 'Time Tracking App Template') {
      continue;
    }

    const type = schemas['fibery/types'].find(v => v['fibery/name'] === collection);
    const fields = type['fibery/fields'];

    const id = 'fibery/id';
    const name = getName(fields);
    const partner = getPartner(fields);
    const team = getTeam(fields);

    const select = [id, name];
    partner && select.push(Object.defineProperty({}, partner, { enumerable: true, value: ['fibery/id', 'enum/name'] }));
    team && select.push(Object.defineProperty({}, team, { enumerable: true, value: ['fibery/id', 'enum/name'] }));

    mappings.push({ project: projectName, fields: { id, name, partner, team }, collections: { specialists: specialistCollections, timeEntries: timeEntriesCollections } });

    query.push({
      command: 'fibery.entity/query',
      args: {
        query: {
          'q/from': collection,
          'q/select': select,
          'q/where': ['=', ['assignments/assignees', 'fibery/id'], '$my-id'],
          'q/limit': 'q/no-limit',
          'q/offset': 0,
        },
      },
    });
  }

  return { query, parse: parseSpecialistsInvolvedQueryResult(mappings) }
}

// time

// export function floatToTime(floatTime: string | number) {
//   let decimalTime = Number.parseFloat(floatTime);
//   decimalTime = decimalTime * 60 * 60;

//   let hours = Math.floor((decimalTime / (60 * 60)));
//   decimalTime = decimalTime - (hours * 60 * 60);

//   let minutes = Math.floor((decimalTime / 60));
//   decimalTime = decimalTime - (minutes * 60);

//   let seconds = Math.round(decimalTime);

//   if (hours < 10) {
//     hours = '0' + hours;
//   }

//   if (minutes < 10) {
//     minutes = '0' + minutes;
//   }

//   if (seconds < 10) {
//     seconds = '0' + seconds;
//   }

//   return {
//     hours,
//     minutes,
//     seconds,
//   };
// }

export function timeToFloat(time: string): number {
  const [hours, minutes = 0, seconds = 0] = time.split(':').map(value => Number.parseInt(value));
  const value = hours + (minutes / 60) + (seconds / 3600);

  if (value <= 0 || Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
    throw new Error(`Wrong time format for value ${time}`);
  }

  return value;
}
