import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {SaleItem, Unit} from '../models';
import {SaleItemRepository} from '../repositories';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class SaleItemUnitController {

  constructor(
    @repository(SaleItemRepository)
    public saleItemRepository: SaleItemRepository,
  ) { }

  @get('/sale-items/{id}/unit', {
    responses: {
      '200': {
        description: 'Unit belonging to SaleItem',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Unit)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.saleView.name,
    ...adminAndUserAuthDetails})
  async getUnit(
    @param.path.string('id') id: typeof SaleItem.prototype.id,
  ): Promise<Unit> {

    const unitR = await this.saleItemRepository.unit(id);
    return unitR;

  }

}
