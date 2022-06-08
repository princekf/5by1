import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import { BindingKeys } from '../binding.keys';
import {Voucher, VoucherRelations, Document, VoucherDocument} from '../models';
import { dsSessionFactory } from '../utils/data-source-session-factory';
import {VoucherDocumentRepository} from './voucher-document.repository';
import {DocumentRepository} from './document.repository';

export class VoucherRepository extends DefaultCrudRepository<
  Voucher,
  typeof Voucher.prototype.id,
  VoucherRelations
> {

  public readonly documents: HasManyThroughRepositoryFactory<Document, typeof Document.prototype.id,
          VoucherDocument,
          typeof Voucher.prototype.id
        >;

  constructor(
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string, @repository.getter('VoucherDocumentRepository') protected voucherDocumentRepositoryGetter: Getter<VoucherDocumentRepository>, @repository.getter('DocumentRepository') protected documentRepositoryGetter: Getter<DocumentRepository>,
  ) {

    super(Voucher, dsSessionFactory.createRunTimeDataSource(dbName));
    this.documents = this.createHasManyThroughRepositoryFactoryFor('documents', documentRepositoryGetter, voucherDocumentRepositoryGetter,);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);

  }

}
