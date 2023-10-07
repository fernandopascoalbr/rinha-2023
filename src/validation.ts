import { validate as validateUUID } from 'uuid';

export class Validation {
  public validations: Function[] = [];

  uuid(uuid: string): boolean {
    return validateUUID(uuid);
  }

  // YYYY-MM-DD
  date(str: string): boolean {
    if (/^\d{4}-\d{2}-\d{2}$/.test(str) === false) return false;

    const [year, month, day] = str.split('-').map((d) => Number(d));
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() == month - 1 &&
      date.getDate() === day
    );
  }
}
