import { repository } from '@loopback/repository';
import { param, get, getModelSchemaRef} from '@loopback/rest';
import {Branch, FinYear} from '../models';
import {BranchRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { authorize, } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
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
            schema: {type: 'array',
              items: getModelSchemaRef(FinYear)},
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.branchView.name,
    ...adminAndUserAuthDetails})
  async getFinYear(
    @param.path.string('id') id: typeof Branch.prototype.id,
  ): Promise<FinYear> {

    const finYearR = await this.branchRepository.defaultFinYear(id);
    return finYearR;

  }

}
