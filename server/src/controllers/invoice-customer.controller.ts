import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Invoice, Customer} from '../models';
import {InvoiceRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class InvoiceCustomerController {

  constructor(
    @repository(InvoiceRepository)
    public invoiceRepository: InvoiceRepository,
  ) { }

  @get('/invoices/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to Invoice',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.invoiceView.name,
    ...adminAndUserAuthDetails})
  async getCustomer(
    @param.path.string('id') id: typeof Invoice.prototype.id,
  ): Promise<Customer> {

    const customerR = await this.invoiceRepository.customer(id);
    return customerR;

  }

}
