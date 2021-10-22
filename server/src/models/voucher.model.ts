import {Entity, model, property} from '@loopback/repository';

@model()
export class Voucher extends Entity {

  constructor(data?: Partial<Voucher>) {
    super(data);
  }
}

export interface VoucherRelations {
  // describe navigational properties here
}

export type VoucherWithRelations = Voucher & VoucherRelations;
