import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import {FbomongoDataSource} from '../datasources';
import {Revenue, RevenueRelations, Customer, Invoice, Bank} from '../models';
import {CustomerRepository} from './customer.repository';
import {InvoiceRepository} from './invoice.repository';
import {BankRepository} from './bank.repository';
import { FBOBaseRepository } from './fbo-base.repository';

export class RevenueRepository extends FBOBaseRepository<
  Revenue,
  typeof Revenue.prototype.id,
  RevenueRelations
> {

  public readonly customer: BelongsToAccessor<Customer, typeof Revenue.prototype.id>;

  public readonly invoice: BelongsToAccessor<Invoice, typeof Revenue.prototype.id>;

  public readonly bank: BelongsToAccessor<Bank, typeof Revenue.prototype.id>;

  constructor(
    @inject('datasources.fbomongo') dataSource: FbomongoDataSource, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>, @repository.getter('InvoiceRepository') protected invoiceRepositoryGetter: Getter<InvoiceRepository>, @repository.getter('BankRepository') protected bankRepositoryGetter: Getter<BankRepository>,
  ) {

    super(Revenue, dataSource);
    this.bank = this.createBelongsToAccessorFor('bank', bankRepositoryGetter,);
    this.registerInclusionResolver('bank', this.bank.inclusionResolver);
    this.invoice = this.createBelongsToAccessorFor('invoice', invoiceRepositoryGetter,);
    this.registerInclusionResolver('invoice', this.invoice.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);

  }

}
