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
  Ledger,
} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionLedgerController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
  ) { }

  @get('/transactions/{id}/ledger', {
    responses: {
      '200': {
        description: 'Ledger belonging to Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ledger)},
          },
        },
      },
    },
  })
  async getLedger(
    @param.path.string('id') id: typeof Transaction.prototype.id,
  ): Promise<Ledger> {
    return this.transactionRepository.ledger(id);
  }
}
