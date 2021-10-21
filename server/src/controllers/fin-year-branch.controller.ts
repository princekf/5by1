import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FinYear,
  Branch,
} from '../models';
import {FinYearRepository} from '../repositories';

export class FinYearBranchController {
  constructor(
    @repository(FinYearRepository)
    public finYearRepository: FinYearRepository,
  ) { }

  @get('/fin-years/{id}/branch', {
    responses: {
      '200': {
        description: 'Branch belonging to FinYear',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Branch)},
          },
        },
      },
    },
  })
  async getBranch(
    @param.path.string('id') id: typeof FinYear.prototype.id,
  ): Promise<Branch> {
    return this.finYearRepository.branch(id);
  }
}
