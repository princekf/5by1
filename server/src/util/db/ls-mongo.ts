import { Connection } from 'mongoose';

class LSMongo {

    private lsConnection:Connection = null;

    private lsConnections:Record<string, Connection> = {};

    init = async(mongoUri:string) => {

      const mongoose = await import('mongoose');
      this.lsConnection = await mongoose.createConnection(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

    }

    disconnect = async() => {

      const mongoose = await import('mongoose');
      await mongoose.disconnect();

    }

    createLSConnection = (dbName:string):Connection => {

      if (!this.lsConnections[dbName] || !this.lsConnections[dbName].readyState) {

        this.lsConnections[dbName] = this.lsConnection.useDb(dbName);

      }
      return this.lsConnections[dbName];

    }

}

export const lsMango = new LSMongo();
