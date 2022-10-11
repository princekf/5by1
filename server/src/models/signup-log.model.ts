import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SignupLog extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'date',
    required: false,
  })
  createdAt: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  emailOK?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SignupLog>) {

    super(data);

  }

}

export interface SignupLogRelations {
  // Describe navigational properties here
}

export type SignupLogWithRelations = SignupLog & SignupLogRelations;
