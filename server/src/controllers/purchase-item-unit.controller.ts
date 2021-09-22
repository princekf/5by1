import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  PurchaseItem,
  Unit,
} from '../models';
import {PurchaseItemRepository} from '../repositories';

export class PurchaseItemUnitController {
  constructor(
    @repository(PurchaseItemRepository)
    public purchaseItemRepository: PurchaseItemRepository,
  ) { }

  @get('/purchase-items/{id}/unit', {
    responses: {
      '200': {
        description: 'Unit belonging to PurchaseItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Unit)},
          },
        },
      },
    },
  })
  async getUnit(
    @param.path.string('id') id: typeof PurchaseItem.prototype.id,
  ): Promise<Unit> {
    return this.purchaseItemRepository.unit(id);
  }
}
