import * as dotenv from 'dotenv';
dotenv.config();
import * as cluster from 'cluster';
import * as os from 'os';

const startApp = async(): Promise<void> => {

  const {app} = await import('./app');
  const {lsMango} = await import('@ls-util/db/ls-mongo');
  await lsMango.init(process.env.MONGODB_URI);
  app.configApp();

  // Start express App
  app.app.listen(process.env.PORT, () => {

    console.warn(`${process.env.MODE} server is running at http://localhost:${process.env.PORT} with process id ${process.pid}`);

  });

};

if (cluster.isMaster) {

  const CPUS: Array<os.CpuInfo> = os.cpus();
  CPUS.forEach(() => cluster.fork());

  cluster.on('online', (worker) => {

    console.warn(`Worker ${worker.process.pid} is online`);

  });

  cluster.on('exit', (worker, code, signal) => {

    console.warn(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.warn('Starting a new worker');
    cluster.fork();

  });

} else {

  startApp();

}
