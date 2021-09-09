import * as dotenv from 'dotenv';
dotenv.config();
import {ApplicationConfig} from './application';
import { ExpressServer } from './server';

export * from './application';
const defaultPort = 9000;
export const main = async(options: ApplicationConfig = {}):Promise<void> => {

  const server = new ExpressServer(options);
  await server.boot();
  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://127.0.0.1:${Number(process.env.PORT ?? defaultPort)}`);

};

if (require.main === module) {

  const config = {
    rest: {
      port: Number(process.env.PORT ?? defaultPort),
      host: process.env.HOST ?? 'localhost',
      openApiSpec: {
        // Useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
      // Use the LB4 application as a route. It should not be listening.
      listenOnStart: false,
    },
  };
  main(config)['catch']((err) => {

    console.error('Cannot start the application.', err);
    process.exit(1);

  });

}
