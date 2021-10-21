import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Branch,
  FinYear,
} from '../models';
import {BranchRepository} from '../repositories';

export class BranchFinYearController {
  constructor(
    @repository(BranchRepository)
    public branchRepository: BranchRepository,
  ) { }

  @get('/branches/{id}/fin-year', {
    responses: {
      '200': {
        description: 'FinYear belonging to Branch',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FinYear)},
          },
        },
      },
    },
  })
  async getFinYear(
    @param.path.string('id') id: typeof Branch.prototype.id,
  ): Promise<FinYear> {
    return this.branchRepository.defaultFinYear(id);
  }
}
