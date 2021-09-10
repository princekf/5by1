import express from 'express';
import {ApplicationConfig, FiveByOneApplication} from './application';
import path from 'path';
import { once } from 'events';
import * as http from 'http';

export {ApplicationConfig};

export class ExpressServer {

  public readonly app: express.Application;

  public readonly lbApp: FiveByOneApplication;

  private server?: http.Server;

  constructor(options: ApplicationConfig = {}) {

    this.app = express();
    this.lbApp = new FiveByOneApplication(options);
    this.app.use('/api', this.lbApp.requestHandler);

    // Intercept requests to return the frontend's static entry point
    this.app.get('*', (_request, response) => {

      response.sendFile(path.resolve('.', 'public', 'index.html'));

    });

  }

  public boot = async():Promise<void> => {

    await this.lbApp.boot();

  };

  public start = async():Promise<void> => {

    await this.lbApp.start();
    const port = this.lbApp.restServer.config.port ?? 3000;
    const host = this.lbApp.restServer.config.host || '127.0.0.1';
    this.server = this.app.listen(port, host);
    await once(this.server, 'listening');

  };

}
