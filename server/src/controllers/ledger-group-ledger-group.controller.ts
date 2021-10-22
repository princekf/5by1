import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  LedgerGroup,
  LedgerGroup,
} from '../models';
import {LedgerGroupRepository} from '../repositories';

export class LedgerGroupLedgerGroupController {
  constructor(
    @repository(LedgerGroupRepository)
    public ledgerGroupRepository: LedgerGroupRepository,
  ) { }

  @get('/ledger-groups/{id}/ledger-group', {
    responses: {
      '200': {
        description: 'LedgerGroup belonging to LedgerGroup',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LedgerGroup)},
          },
        },
      },
    },
  })
  async getLedgerGroup(
    @param.path.string('id') id: typeof LedgerGroup.prototype.id,
  ): Promise<LedgerGroup> {
    return this.ledgerGroupRepository.parent(id);
  }
}
