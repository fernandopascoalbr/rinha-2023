import { Request, Response, NextFunction } from 'express';
import { Validation } from './validation';

export class Middleware {
  constructor(private validation: Validation) {}

  public validateUuid(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const err = this.validation.uuid(id).run();

    if (err) {
      res.status(404).end();
      return;
    }

    next();
  }

  public validateQuery(req: Request, res: Response, next: NextFunction) {
    const term = req.query.t;

    const err = this.validation.requiredStr(term as string).run();

    if (err) {
      res.status(400).end();
      return;
    }

    next();
  }

  public validateBodyPessoa(req: Request, res: Response, next: NextFunction) {
    const obj = { ...req.body };

    let err = this.validation
      .isStrOrNull(obj.nome)
      .isStrOrNull(obj.apelido)
      .isStrOrNull(obj.nascimento)
      .arrayStrNullable(obj.stack)
      .run();

    if (err) {
      res.status(400).end();
      return;
    }

    err = this.validation
      .requiredStr(obj.nome)
      .requiredStr(obj.apelido)
      .requiredStr(obj.nascimento)
      .max(obj.apelido, 32)
      .max(obj.nome, 100)
      .date(obj.nascimento)
      .run();

    if (err) {
      res.status(422).end();
      return;
    }

    next();
  }

  public handlerError(err: any, req: Request, res: Response) {
    res.status(500).send('');
  }
}
