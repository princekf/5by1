import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Ledger,
  LedgerGroup,
} from '../models';
import {LedgerRepository} from '../repositories';

export class LedgerLedgerGroupController {
  constructor(
    @repository(LedgerRepository)
    public ledgerRepository: LedgerRepository,
  ) { }

  @get('/ledgers/{id}/ledger-group', {
    responses: {
      '200': {
        description: 'LedgerGroup belonging to Ledger',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LedgerGroup)},
          },
        },
      },
    },
  })
  async getLedgerGroup(
    @param.path.string('id') id: typeof Ledger.prototype.id,
  ): Promise<LedgerGroup> {
    return this.ledgerRepository.ledgerGroup(id);
  }
}
