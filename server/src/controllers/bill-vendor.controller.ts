import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Bill,
  Vendor,
} from '../models';
import {BillRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { basicAuthorization } from '../middlewares/auth.midd';

@authenticate('jwt')
@authorize({
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
})
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
  async getVendor(
    @param.path.string('id') id: typeof Bill.prototype.id,
  ): Promise<Vendor> {

    return this.billRepository.vendor(id);

  }

}
