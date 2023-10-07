import { describe, it } from 'node:test';
import { faker } from '@faker-js/faker';
import { Validation } from '../src/validation';
import assert, { AssertionError } from 'node:assert';

const nascimento = '2023-01-01';

const validation = new Validation();

describe('Should be validate form and return statusCode', () => {
  it('uuid', () => {
    const id = faker.string.uuid();
    const id2 = 'id';
    const er1 = validation.uuid(id).run();
    const er2 = validation.uuid(id2).run();

    assert.equal(er1, null);
    assert.equal(er2?.name, new Error().name);
  });

  it('max length', () => {
    const str = ''.padEnd(100, '0')

    let err = validation.max(str, 100).run();
    assert.equal(err, null);

    err = validation.max(str, 99).run();
    assert.notEqual(err, null);
  });

  it('requiredStr', () => {
    let err = validation.requiredStr('0').run();
    assert.equal(err, null);

    err = validation.requiredStr('').run();
    assert.notEqual(err, null);

    err = validation.requiredStr(8).run();
    assert.notEqual(err, null);
  });

  it('date', () => {
    let err = validation.date('2022-10-23').run();
    assert.equal(err, null);

    err = validation.date('20222-10-10').run();
    assert.notEqual(err, null);

    err = validation.date('2022-15-10').run();
    assert.notEqual(err, null);

    err = validation.date('2022-15-42').run();
    assert.notEqual(err, null);
  });

  it('arrayStrNullable', () => {
    let err = validation.arrayStrNullable([]).run();
    assert.equal(err, null);

    err = validation.arrayStrNullable(['valid']).run();
    assert.equal(err, null);

    err = validation.arrayStrNullable([1]).run();
    assert.notEqual(err, null);

    err = validation.arrayStrNullable('invalid type').run();
    assert.notEqual(err, null);

    err = validation.arrayStrNullable(1).run();
    assert.notEqual(err, null);

    err = validation.arrayStrNullable({v: 'invalid'}).run();
    assert.notEqual(err, null);
  });
});
