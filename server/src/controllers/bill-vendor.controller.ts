import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Bill, Vendor} from '../models';
import {BillRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class BillVendorController {

  constructor(
    @repository(BillRepository)
    public billRepository: BillRepository,
  ) { }

  @get('/bills/{id}/vendor', {
    responses: {
      '200': {
        description: 'Vendor belonging to Bill',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Vendor)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.billView.name,
    ...adminAndUserAuthDetails})
  async getVendor(
    @param.path.string('id') id: typeof Bill.prototype.id,
  ): Promise<Vendor> {

    const vendorR = await this.billRepository.vendor(id);
    return vendorR;

  }

}
