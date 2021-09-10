import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'fbomongo',
  connector: 'mongodb',
  url: process.env.MONGODB_URI,
  database: 'fboerp',
  useNewUrlParser: true
};

/*
 * Observe application's life cycle to disconnect the datasource when
 * application is stopped. This allows the application to be shut down
 * gracefully. The `stop()` method is inherited from `juggler.DataSource`.
 * Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
 */
@lifeCycleObserver('datasource')
export class FbomongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {

  static dataSourceName = config.name;

  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.fbomongo', {optional: true})
    dsConfig: Record<string, unknown> = config,
  ) {

    super(dsConfig);

  }

}
