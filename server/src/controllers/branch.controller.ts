import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors } from '@loopback/rest';
import {Branch} from '../models/branch.model';
import {BranchRepository} from '../repositories/branch.repository';
import { BRANCH_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize, } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminOnlyAuthDetails } from '../utils/authorize-details';
import { ValidateBranchForUniqueCodeInterceptor } from '../interceptors/validate-branch-for-unique-code.interceptor';
import { intercept } from '@loopback/context';

@authenticate('jwt')
@authorize(adminOnlyAuthDetails)
export class BranchController {

  constructor(
    @repository(BranchRepository)
    public branchRepository : BranchRepository,
  ) {}

  @intercept(ValidateBranchForUniqueCodeInterceptor.BINDING_KEY)
  @post(BRANCH_API)
  @response(200, {
    description: 'Branch model instance',
    content: {'application/json': {schema: getModelSchemaRef(Branch)}},
  })
  @authorize({resource: resourcePermissions.branchCreate.name,
    ...adminOnlyAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Branch, {
            title: 'NewBranch',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      branch: Omit<Branch, 'id'>,
  ): Promise<Branch> {

    const branchR = await this.branchRepository.create(branch);
    return branchR;

  }

  @get(`${BRANCH_API}/count`)
  @response(200, {
    description: 'Branch model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.branchView.name,
    ...adminOnlyAuthDetails})
  async count(
    @param.where(Branch) where?: Where<Branch>,
  ): Promise<Count> {

    const countR = await this.branchRepository.count(where);
    return countR;

  }

  @get(BRANCH_API)
  @response(200, {
    description: 'Array of Branch model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Branch, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.branchView.name,
    ...adminOnlyAuthDetails})
  async find(
    @param.filter(Branch) filter?: Filter<Branch>,
  ): Promise<Branch[]> {

    const branchesR = await this.branchRepository.find(filter);
    return branchesR;

  }

  @patch(BRANCH_API)
  @response(200, {
    description: 'Branch PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.branchUpdate.name,
    ...adminOnlyAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Branch, {partial: true}),
        },
      },
    })
      branch: Branch,
    @param.where(Branch) where?: Where<Branch>,
  ): Promise<Count> {

    const countR = await this.branchRepository.updateAll(branch, where);
    return countR;

  }

  @get(`${BRANCH_API}/{id}`)
  @response(200, {
    description: 'Branch model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Branch, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.branchView.name,
    ...adminOnlyAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Branch, {exclude: 'where'}) filter?: FilterExcludingWhere<Branch>
  ): Promise<Branch> {

    const branchR = await this.branchRepository.findById(id, filter);
    return branchR;

  }

  @patch(`${BRANCH_API}/{id}`)
  @response(204, {
    description: 'Branch PATCH success',
  })
  @authorize({resource: resourcePermissions.branchUpdate.name,
    ...adminOnlyAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Branch, {partial: true}),
        },
      },
    })
      branch: Branch,
  ): Promise<void> {

    await this.branchRepository.updateById(id, branch);

  }

  @put(`${BRANCH_API}/{id}`)
  @response(204, {
    description: 'Branch PUT success',
  })
  @authorize({resource: resourcePermissions.branchUpdate.name,
    ...adminOnlyAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() branch: Branch,
  ): Promise<void> {

    await this.branchRepository.replaceById(id, branch);

  }

  @del(`${BRANCH_API}/{id}`)
  @response(204, {
    description: 'Branch DELETE success',
  })
  @authorize({resource: resourcePermissions.branchDelete.name,
    ...adminOnlyAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.branchRepository.deleteById(id);

  }


  @del(BRANCH_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.branchDelete.name,
    ...adminOnlyAuthDetails})
  async deleteAll(
    @param.where(Branch) where?: Where<Branch>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Branch ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Branch ids are required');

    }

    const count = await this.branchRepository.deleteAll(where);
    return count;

  }

}
