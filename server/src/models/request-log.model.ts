import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RequestLog extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  branch?: string;

  @property({
    type: 'string',
  })
  finYear?: string;

  @property({
    type: 'date',
  })
  reqAt?: Date;

  @property({
    type: 'date',
  })
  respAt?: Date;

  @property({
    type: 'string',
  })
  baseUrl?: string;

  @property({
    type: 'string',
  })
  method?: string;

  @property({
    type: 'string',
  })
  path?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RequestLog>) {

    super(data);

  }

}

export interface RequestLogRelations {
  // Describe navigational properties here
}

export type RequestLogWithRelations = RequestLog & RequestLogRelations;
