import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import { FinYear, Branch} from '../models';
import {FinYearRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
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
            schema: {type: 'array',
              items: getModelSchemaRef(Branch)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.finyearView.name,
    ...adminAndUserAuthDetails})
  async getBranch(
    @param.path.string('id') id: typeof FinYear.prototype.id,
  ): Promise<Branch> {

    const branchR = await this.finYearRepository.branch(id);
    return branchR;

  }

}
