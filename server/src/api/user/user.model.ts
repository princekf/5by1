import { Document, Schema, Model } from 'mongoose';
import { lsMango } from '@ls-util/db/ls-mongo';
import { UserS } from '@shared/entity/User';

export interface UserDoc extends Document, UserS {
  hash: string;
  salt: string;
}

export class UserModel {

    createShema = ():Schema<UserDoc> => new Schema<UserDoc>({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: false,
        trim: true,
        index: true,
        lowercase: true,
      },
      hash: {
        type: String,
        required: false,
      },
      salt: {
        type: String,
        required: false,
      }
    });

    public static createModel = (): Model<UserDoc, Record<string, never>> => {

      const userSchema = new UserModel().createShema();
      const mongoConnection = lsMango.createLSConnection(process.env.COMMON_DB);
      return mongoConnection.model('User', userSchema, 'user');

    }

}
