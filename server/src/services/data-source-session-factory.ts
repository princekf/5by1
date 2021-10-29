import { FboCommonMongoDataSource, FbomongoDataSource } from '../datasources';
class DataSourceSessionFactory {

    private dataSources:Record<string, FbomongoDataSource> = {};

    createRunTimeDataSource(dbName: string):FbomongoDataSource {

      if (this.dataSources[dbName]) {

        return this.dataSources[dbName];

      }

      const dSource = new FbomongoDataSource({
        name: 'fbomongo',
        connector: 'mongodb',
        url: `${process.env.MONGODB_URI}/${dbName}`,
        database: dbName,
        useNewUrlParser: true
      });

      this.dataSources[dbName] = dSource;
      return dSource;

    }

}

export const dsSessionFactory = new DataSourceSessionFactory();
