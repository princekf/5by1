import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Revenue, Invoice} from '../models';
import {RevenueRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class RevenueInvoiceController {

  constructor(
    @repository(RevenueRepository)
    public revenueRepository: RevenueRepository,
  ) { }

  @get('/revenues/{id}/invoice', {
    responses: {
      '200': {
        description: 'Invoice belonging to Revenue',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Invoice)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.revenueView.name,
    ...adminAndUserAuthDetails})
  async getInvoice(
    @param.path.string('id') id: typeof Revenue.prototype.id,
  ): Promise<Invoice> {

    const invoiceR = await this.revenueRepository.invoice(id);
    return invoiceR;

  }

}
