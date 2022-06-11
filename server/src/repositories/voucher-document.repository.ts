import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {VoucherDocument, VoucherDocumentRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class VoucherDocumentRepository extends DefaultCrudRepository<
  VoucherDocument,
  typeof VoucherDocument.prototype.id,
  VoucherDocumentRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(VoucherDocument, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
