import {Entity, model, property, hasMany} from '@loopback/repository';
import { Voucher as VoucherIntf, VoucherType } from '@shared/entity/accounting/voucher';
import { Document } from './document.model';
import { Transaction } from './transaction.model';
import {VoucherDocument} from './voucher-document.model';

@model()
export class Voucher extends Entity implements VoucherIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
  })
  number: string;

  @property({
    type: 'date',
    required: true
  })
  date: Date;

  @property({
    type: 'string',
  })
  type: VoucherType;

  @property({
    type: 'string',
  })
  details: string;

  @property.array(Transaction)
  transactions: Transaction[];

  @hasMany(() => Document, {through: {model: () => VoucherDocument}})
  documents: Document[];

  constructor(data?: Partial<Voucher>) {

    super(data);

  }

}

export interface VoucherRelations {
  // Describe navigational properties here
}

export type VoucherWithRelations = Voucher & VoucherRelations;
