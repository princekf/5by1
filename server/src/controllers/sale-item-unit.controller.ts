import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SaleItem,
  Unit,
} from '../models';
import {SaleItemRepository} from '../repositories';

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
            schema: {type: 'array', items: getModelSchemaRef(Unit)},
          },
        },
      },
    },
  })
  async getUnit(
    @param.path.string('id') id: typeof SaleItem.prototype.id,
  ): Promise<Unit> {
    return this.saleItemRepository.unit(id);
  }
}
