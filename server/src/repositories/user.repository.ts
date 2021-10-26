import {inject, Getter} from '@loopback/core';
import {repository, HasOneRepositoryFactory} from '@loopback/repository';
import { FBOBaseRepository } from '.';
import { BindingKeys } from '../binding.keys';
import {User, UserRelations, UserCredentials} from '../models';
import { dsSessionFactory } from '../services/data-source-session-factory';
import {UserCredentialsRepository} from './user-credentials.repository';

export type Credentials = {
  email: string;
  password: string;
  role?: string;
  company?: string;
};

export class UserRepository extends FBOBaseRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;

  constructor(
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(User, dsSessionFactory.createRunTimeDataSource(dbName));
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);

  }

  public findCredentials = async(userId: typeof User.prototype.id): Promise<UserCredentials | null> => {

    try {

      return await this.userCredentials(userId).get();

    } catch (err:any) {

      if (err.code === 'ENTITY_NOT_FOUND') {

        return null;

      }
      throw err;

    }

  };

}
