import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Invoice, InvoiceRelations} from '../models/invoice.model';
import {Customer} from '../models';
import {CustomerRepository} from './customer.repository';
import { BindingKeys } from '../binding.keys';
import { dsSessionFactory } from '../utils/data-source-session-factory';

export class InvoiceRepository extends DefaultCrudRepository<
  Invoice,
  typeof Invoice.prototype.id,
  InvoiceRelations
> {

  public readonly customer: BelongsToAccessor<Customer, typeof Invoice.prototype.id>;

  constructor(
    @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>,
    @inject(BindingKeys.SESSION_DB_NAME) dbName: string
  ) {

    super(Invoice, dsSessionFactory.createRunTimeDataSource(dbName));
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);

  }

}
