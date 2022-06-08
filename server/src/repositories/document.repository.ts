import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Document, DocumentRelations} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class DocumentRepository extends DefaultCrudRepository<
  Document,
  typeof Document.prototype.id,
  DocumentRelations
> {

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Document, dsSessionFactory.createRunTimeDataSource(dbName));

  }

}
