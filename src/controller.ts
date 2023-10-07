import { Request, Response } from 'express';
import { Pessoa } from './pessoa';
import { Repository } from './repository';

export class PessoaController {
  constructor(private repo: Repository) {}

  teste(_: Request, res: Response) {
    res.send('ok');
  }

  async createPessoa(req: Request, res: Response): Promise<void> {
    const pessoa = Pessoa.create(req.body);

    this.repo
      .create(pessoa)
      .then((result) => {
        res
          .status(result.rowCount > 0 ? 201 : 422)
          .setHeader('location', `/pessoas/${pessoa.id}`)
          .end()
      })
      .catch((err) => {
        res.status(422).send(err?.code || '');
      });
  }

  public async getPessoaById(req: Request, res: Response): Promise<void> {
    this.repo
      .findById(req.params.id)
      .then((result) => {
        const data = result.rows[0];
        const pessoa = data ? Pessoa.create({ ...data }) : null;

        res.status(!pessoa ? 404 : 200).send(pessoa?.toString());
      })
      .catch(() => {
        res.status(404).end();
      });
  }

  public async getPessoaByTerm(req: Request, res: Response): Promise<void> {
    const term = req.query.t as string;

    this.repo
      .findAll(term)
      .then((result) => {
        const data = result.rows.map((r) => Pessoa.create(r));
        res.status(200).send(JSON.stringify(data));
      })
      .catch(() => {
        res.status(200).send([]);
      });
  }

  async getPessoasCount(_: Request, res: Response): Promise<void> {
    this.repo
      .count()
      .then((result) => {
        res.status(200).send(result.rows[0].count);
      })
      .catch(() => {
        res.status(200).send(0);
      });
  }
}
