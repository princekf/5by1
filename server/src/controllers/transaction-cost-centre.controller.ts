import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Transaction,
  CostCentre,
} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionCostCentreController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
  ) { }

  @get('/transactions/{id}/cost-centre', {
    responses: {
      '200': {
        description: 'CostCentre belonging to Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CostCentre)},
          },
        },
      },
    },
  })
  async getCostCentre(
    @param.path.string('id') id: typeof Transaction.prototype.id,
  ): Promise<CostCentre> {
    return this.transactionRepository.costCentre(id);
  }
}
