import {Entity, model, property, hasOne} from '@loopback/repository';
import {UserCredentials} from './auth/user-credentials.model';
import { Permission, User as UserInft } from '@shared/entity/auth/user';
import { Branch } from './branch.model';

@model()
export class User extends Entity implements UserInft {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    nullable: false,
  })
  role: string;

  @property({
    type: 'object',
  })
  permissions: Record<string, Permission>;

  branches: Array<Branch>;

  @property({
    type: 'array',
    itemType: 'string',
  })
  branchIds?: string[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {

    super(data);

  }

}

export interface UserRelations {
  // Describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
