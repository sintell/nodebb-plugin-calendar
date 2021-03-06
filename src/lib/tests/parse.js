import parse from '../parse';
import assert from 'assert';

const setEquals = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  for (const x of a) {
    let found = false;
    for (const y of b) {
      if (x === y) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
};

[
  () => {
    // basic test
    const data = {
      name: 'a test name',
      allday: true,
      startDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      endDate: Date.now(),
      reminders: [0, 10, 20, 50],
      location: 'here somewhere',
      description: 'somewhere else',
    };
    const result = parse(
      `other things that make sense
      [event]
        [name]${data.name}[/name]
        [allday]${data.allday}[/allday]
        [startDate]${data.startDate}[/startDate]
        [endDate]${data.endDate}[/endDate]
        [reminders]${JSON.stringify(data.reminders)}[/reminders]
        [location]${data.location}[/location]
        [description]
          ${data.description}
        [/description]
      [/event]
      and some more *markdown*`
    );

    assert(result && typeof result === 'object', 'Expected Object, got a falsy value');
    assert.strictEqual(data.name, result.name, '`name` field incorrect');
    assert.strictEqual(data.allday, result.allday, '`allday` field incorrect');
    assert.strictEqual(data.startDate, result.startDate, '`startDate` field incorrect');
    assert.strictEqual(data.endDate, result.endDate, '`endDate` field incorrect');
    assert(setEquals(data.reminders, result.reminders),
      '`reminders` field incorrect');
    assert.strictEqual(data.location, result.location, '`location` field incorrect');
    assert.strictEqual(data.description, result.description, '`description` field incorrect');
  },
  () => {
    // test allday false
    const data = {
      name: 'a test name',
      allday: false,
      startDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      endDate: Date.now(),
      reminders: [0, 10, 20, 50],
      location: 'here somewhere',
      description: 'somewhere else',
    };
    const result = parse(
      `[event]
        [name]${data.name}[/name]
        [allday]${data.allday}[/allday]
        [startDate]${data.startDate}[/startDate]
        [endDate]${data.endDate}[/endDate]
        [reminders]${JSON.stringify(data.reminders)}[/reminders]
        [location]${data.location}[/location]
        [description]
          ${data.description}
        [/description]
      [/event]`
    );
    assert(result && typeof result === 'object', 'Expected Object, got a falsy value');
    assert.strictEqual(data.name, result.name, '`name` field incorrect');
    assert.strictEqual(data.allday, result.allday, '`allday` field incorrect');
    assert.strictEqual(data.startDate, result.startDate, '`startDate` field incorrect');
    assert.strictEqual(data.endDate, result.endDate, '`endDate` field incorrect');
    assert(setEquals(data.reminders, result.reminders),
      '`reminders` field incorrect');
    assert.strictEqual(data.location, result.location, '`location` field incorrect');
    assert.strictEqual(data.description, result.description, '`description` field incorrect');
  },
  () => {
    // test bad date failing completely
    const data = {
      name: 'a test name',
      allday: false,
      startDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      endDate: 'a string',
      reminders: [0, 10, 20, 50],
      location: 'here somewhere',
      description: 'somewhere else',
    };
    const result = parse(
      `[event]
        [name]${data.name}[/name]
        [allday]${data.allday}[/allday]
        [startDate]${data.startDate}[/startDate]
        [endDate]${data.endDate}[/endDate]
        [reminders]${JSON.stringify(data.reminders)}[/reminders]
        [location]${data.location}[/location]
        [description]
          ${data.description}
        [/description]
      [/event]`
    );
    assert.strictEqual(null, result, 'Expected null, got something else');
  },
  () => {
    // test bad reminders failing completely
    const data = {
      name: 'a test name',
      allday: false,
      startDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      endDate: Date.now(),
      reminders: 'a string',
      location: 'here somewhere',
      description: 'somewhere else',
    };
    const result = parse(
      `[event]
        [name]${data.name}[/name]
        [allday]${data.allday}[/allday]
        [startDate]${data.startDate}[/startDate]
        [endDate]${data.endDate}[/endDate]
        [reminders]${JSON.stringify(data.reminders)}[/reminders]
        [location]${data.location}[/location]
        [description]
          ${data.description}
        [/description]
      [/event]`
    );
    assert.strictEqual(null, result, 'Expected null, got something else');
  },
  () => {
    // test bad location failing completely
    const data = {
      name: 'a test name',
      allday: false,
      startDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      endDate: Date.now(),
      reminders: [0, 10, 20, 50],
      location: 'here somewhere\nhasbbks',
      description: 'somewhere else',
    };
    const result = parse(
      `[event]
        [name]${data.name}[/name]
        [allday]${data.allday}[/allday]
        [startDate]${data.startDate}[/startDate]
        [endDate]${data.endDate}[/endDate]
        [reminders]${JSON.stringify(data.reminders)}[/reminders]
        [location]${data.location}[/location]
        [description]
          ${data.description}
        [/description]
      [/event]`
    );
    assert.strictEqual(null, result, 'Expected null, got something else');
  },
  () => {
    // test bad name failing completely
    const data = {
      name: 'a test name\ndsjvhoaho',
      allday: false,
      startDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      endDate: Date.now(),
      reminders: [0, 10, 20, 50],
      location: 'here somewhere',
      description: 'somewhere else',
    };
    const result = parse(
      `[event]
        [name]${data.name}[/name]
        [allday]${data.allday}[/allday]
        [startDate]${data.startDate}[/startDate]
        [endDate]${data.endDate}[/endDate]
        [reminders]${JSON.stringify(data.reminders)}[/reminders]
        [location]${data.location}[/location]
        [description]
          ${data.description}
        [/description]
      [/event]`
    );
    assert.strictEqual(null, result, 'Expected null, got something else');
  },
].forEach((x) => x());
