import { v4, validate } from 'uuid';

export interface P {
  id: string;
  nome: string;
  apelido: string;
  nascimento: string;
  stack: string[];
}

export class Pessoa {
  id: string;
  nome: string;
  apelido: string;
  nascimento: string;
  stack: string[];

  private constructor({ id, nome, apelido, nascimento, stack }: P) {
    this.id = id;
    this.nome = nome;
    this.apelido = apelido;
    this.nascimento = nascimento;
    this.stack = stack;
  }

  static create(params: Partial<P>) {
    if (!params.id) Reflect.set(params, 'id', v4());
    return new Pessoa(params as P);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      apelido: this.apelido,
      nascimento: this.nascimento,
      stack: this.stack
    };
  }
}
