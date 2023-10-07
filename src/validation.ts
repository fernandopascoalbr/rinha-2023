import { validate as validateUUID } from 'uuid';

export class Validation {
  public validations: Function[] = [];

  uuid(uuid: string) {
    this.validations.push(() => {
      const isValid = validateUUID(uuid);
      if (!isValid) throw new Error('Invalid uuid');
    });
    
    return this;
  }

  isStrOrNull(obj: any): Validation {
    this.validations.push(() => {
      const valid = obj === null || typeof obj === 'string'
      if(!valid) throw new Error('isStrOrNull field')
    });
    return this;
  }

  notNull(obj: any): Validation {
    this.validations.push(() => {
      const isValid = obj !== null && obj !== undefined
      if(!isValid) throw new Error('Required field')
    });
    return this;
  }
  
  arrayStrNullable(obj: any): Validation {
    this.validations.push(() => {
      if(obj === null) return
      if(!Array.isArray(obj)) throw new Error('invalid data to arrayStrNullable')
      const isValid = obj.every(v => typeof v === 'string')

      if(!isValid) throw new Error('invalid data to arrayStrNullable')
    });
    return this;
  }

  // YYYY-MM-DD
  date(str: string): Validation {
    this.validations.push(() => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(str) === false)
        throw new Error('invalid date');

      const [year, month, day] = str.split('-').map((d) => Number(d));
      const date = new Date(year, month - 1, day);

      const valid =
        date.getFullYear() === year &&
        date.getMonth() == month - 1 &&
        date.getDate() === day;

      if (!valid) throw new Error('invalid date');
    });

    return this;
  }

  str(value: any): Validation {
    this.validations.push(() => {
      const isValid = typeof value === 'string';
      if (!isValid) throw new Error('Invalid type');
    });

    return this;
  }

  requiredStr(value: any): Validation {
    this.validations.push(() => {
      const isValid = typeof value === 'string' && value.length > 0;
      if (!isValid) throw new Error('Required field');
    });

    return this;
  }

  max(value: string, max: number): Validation {
    this.validations.push(() => {
      const isValid = value.length <= max;
      if (!isValid) throw new Error(`Max field length is ${max}`);
    });

    return this;
  }

  run(): null | Error {
    let error = null;

    for (const fn of this.validations) {
      try {
        fn();
      } catch (err: unknown) {
        error = err as Error;
        break;
      }
    }

    this.validations = [];

    return error;
  }
}
