import { QueryResult } from 'pg';
import { Database } from './database';
import { Pessoa } from './pessoa';

export class Repository {
  items: any[] = [];

  constructor(private readonly pool: Database.Pool) {}

  async findById(id: string): Promise<QueryResult<any>> {
    return this.pool.query(
      `
      SELECT
        id,
        nome,
        apelido,
        nascimento,
        stack
      FROM pessoas p
      WHERE id='${id}'
      `
    );
  }

  async findAll(term: string): Promise<QueryResult<any>> {
    return this.pool.query(
      `
      SELECT
        id,
        nome,
        apelido,
        nascimento,
        stack
      FROM pessoas p
      WHERE p.search ILIKE '%${term}%'
      LIMIT 50;
      `
    );
  }

  async count(): Promise<QueryResult<any>> {
    return this.pool.query(
      `
        select count(*) from pessoas
      `
    );
  }

  async create(data: Pessoa): Promise<QueryResult<any>> {
    return this.pool.query(
      'insert into pessoas (id, nome, apelido, nascimento, stack) values ($1, $2, $3, $4, $5)',
      [data.id, data.nome, data.apelido, data.nascimento, data.stack]
    );
  }
}
