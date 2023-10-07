import 'dotenv/config';
import * as bodyParser from 'body-parser';
import express from 'express';
import { PessoaController } from './controller';
import { Validation } from './validation';
import { Middleware } from './middleware';
import { Database } from './database';
import { Repository } from './repository';


const validation = new Validation();
const database = new Database();

const repository = new Repository(database.pool);
const controller = new PessoaController(repository);
const middleware = new Middleware(validation);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app
  .get('/', controller.teste.bind(controller))
  .get(
    '/contagem-pessoas',
    controller.getPessoasCount.bind(controller)
  )
  .get(
    '/pessoas/:id',
    middleware.validateUuid.bind(middleware),
    controller.getPessoaById.bind(controller)
  )
  .post(
    '/pessoas',
    middleware.validateBodyPessoa.bind(middleware),
    controller.createPessoa.bind(controller)
  )
  .get(
    '/pessoas',
    middleware.validateQuery.bind(middleware),
    controller.getPessoaByTerm.bind(controller)
  );

app.use(middleware.handlerError.bind(middleware))


app.listen(process.env.PORT, () => {
  console.info(`Listen at ${process.env.PORT}`);
});

export { app };
