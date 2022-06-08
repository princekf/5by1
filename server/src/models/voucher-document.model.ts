import {Entity, model, property} from '@loopback/repository';
import { VoucherDocument as VucherDocumentIntf } from '@shared/entity/accounting/voucher-document';
@model()
export class VoucherDocument extends Entity implements VucherDocumentIntf {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  voucherId: string;

  @property({
    type: 'string',
  })
  documentId: string;

  constructor(data?: Partial<VoucherDocument>) {

    super(data);

  }

}

export interface VoucherDocumentRelations {
  // Describe navigational properties here
}

export type VoucherDocumentWithRelations = VoucherDocument & VoucherDocumentRelations;
