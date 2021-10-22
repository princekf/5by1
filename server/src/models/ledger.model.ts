import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Ledger extends Entity {
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Ledger>) {
    super(data);
  }
}

export interface LedgerRelations {
  // describe navigational properties here
}

export type LedgerWithRelations = Ledger & LedgerRelations;
