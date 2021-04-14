import { BASE_URI, USER_API } from '@shared/serverAPI';
import Fastify, { FastifyInstance } from 'fastify';
import userController from '@ls-api/user/user.controller';

class App {

  public app: FastifyInstance;

  constructor() {

    this.app = Fastify({});

  }

  configApp = (): void => {

    this.app.register(userController.router, { prefix: `${BASE_URI}${USER_API}` });


  }

}

export const app = new App();
