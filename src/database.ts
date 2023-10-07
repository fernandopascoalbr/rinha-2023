import * as PG from 'pg';

export class Database {
  pool: PG.Pool;
  timeout: any;

  constructor() {
    this.pool = new PG.Pool({
      max: Number(process.env.DATABASE_POOL),
      user: process.env.DATABASE_USER,
      port: Number(process.env.DATABASE_PORT),
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE,
      password: process.env.DATABASE_PASSWORD,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 10000
    });
    
    this.pool.once('connect', () => {
      console.info('DB CONNECTED');
      this.createTable();
    });

    this.pool.on('error', (err) => {
      console.error('DB ERROR', err);
      setTimeout(() => {
        this.connect();
      }, 1000);
    });

    this.connect();
  }

  connect() {
    this.pool.connect();
  }

  createTable() {
    return this.pool.query(`
      CREATE OR REPLACE FUNCTION JOIN_STACK(
          arr TEXT[],
          sep TEXT
      ) RETURNS TEXT AS $$
      DECLARE
          result TEXT := '';
          i INT;
      BEGIN
          IF arr IS NULL THEN
              RETURN NULL;
          END IF;
          
          FOR i IN 1..array_length(arr, 1) LOOP
              result := result || arr[i];
              IF i < array_length(arr, 1) THEN
                  result := result || sep;
              END IF;
          END LOOP;
          RETURN result;
      END;
      $$ LANGUAGE plpgsql IMMUTABLE;


      CREATE TABLE IF NOT EXISTS pessoas (
          id UUID PRIMARY KEY,
          apelido VARCHAR(32) UNIQUE NOT NULL,
          nome VARCHAR(100) NOT NULL,
          nascimento VARCHAR(10) NOT NULL,
          stack VARCHAR(32)[] NULL,
          search TEXT GENERATED ALWAYS AS (
              nome || ' ' || apelido || ' ' || COALESCE(JOIN_STACK(stack, ''), '')
          ) STORED
      );
    `);
  }
}

export namespace Database {
  export type Pool = PG.Pool;
}
