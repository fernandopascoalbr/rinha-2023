import { Request, Response, NextFunction } from 'express';
import { Validation } from './validation';

export class Middleware {
  constructor(private validation: Validation) {}

  public validateUuid(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const isValid = this.validation.uuid(id);

    if (!isValid) {
      res.status(404).end();
      return;
    }

    next();
  }

  public validateQuery(req: Request, res: Response, next: NextFunction) {
    const term = req.query.t;

    if(!term) {
      res.status(400).end()
      return
    }

    next();
  }

  public validateBodyPessoa(req: Request, res: Response, next: NextFunction) {
    const { nome, apelido, nascimento, stack } = req.body;

    const values = [nome, apelido, nascimento];
    const stk = stack === null ? [] : stack.map((s: any) => typeof s);

    if (
      values.some((t: string) => typeof t !== 'string' || t !== null) ||
      stk.some((t: string) => t !== 'string')
    ) {
      res.status(400).end();
      return;
    }

    if([...values, ...stk].some((v: string) => !v)) {
      res.status(422).end()
      return;
    }

    if(nome.length > 100 || apelido > 32 || stk?.some((s: string) => s.length > 32)) {
      res.status(422).end()
      return;
    }

    if(!this.validation.date(nascimento)) {
      res.status(422).end()
      return;
    }

    next();
  }

  public handlerError(err: any, req: Request, res: Response) {
    res.status(500).send('');
  }
}
