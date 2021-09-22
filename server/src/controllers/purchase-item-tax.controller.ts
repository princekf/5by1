import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
PurchaseItem,
PurchaseItemTax,
Tax,
} from '../models';
import {PurchaseItemRepository} from '../repositories';

export class PurchaseItemTaxController {
  constructor(
    @repository(PurchaseItemRepository) protected purchaseItemRepository: PurchaseItemRepository,
  ) { }

  @get('/purchase-items/{id}/taxes', {
    responses: {
      '200': {
        description: 'Array of PurchaseItem has many Tax through PurchaseItemTax',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tax)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tax>,
  ): Promise<Tax[]> {
    return this.purchaseItemRepository.taxes(id).find(filter);
  }

  @post('/purchase-items/{id}/taxes', {
    responses: {
      '200': {
        description: 'create a Tax model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tax)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof PurchaseItem.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tax, {
            title: 'NewTaxInPurchaseItem',
            exclude: ['id'],
          }),
        },
      },
    }) tax: Omit<Tax, 'id'>,
  ): Promise<Tax> {
    return this.purchaseItemRepository.taxes(id).create(tax);
  }

  @patch('/purchase-items/{id}/taxes', {
    responses: {
      '200': {
        description: 'PurchaseItem.Tax PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tax, {partial: true}),
        },
      },
    })
    tax: Partial<Tax>,
    @param.query.object('where', getWhereSchemaFor(Tax)) where?: Where<Tax>,
  ): Promise<Count> {
    return this.purchaseItemRepository.taxes(id).patch(tax, where);
  }

  @del('/purchase-items/{id}/taxes', {
    responses: {
      '200': {
        description: 'PurchaseItem.Tax DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tax)) where?: Where<Tax>,
  ): Promise<Count> {
    return this.purchaseItemRepository.taxes(id).delete(where);
  }
}
