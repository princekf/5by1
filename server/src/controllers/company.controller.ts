import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, RequestContext } from '@loopback/rest';
import {Company} from '../models/company.model';
import {CompanyRepository, UserRepository} from '../repositories';
import { COMPANY_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { CompanyModelForCreateSchema } from '../models/company.create.model';
import {Getter, inject, intercept} from '@loopback/context';
import { BindingKeys } from '../binding.keys';
import { PasswordHasher } from '../services';
import { permissions } from '@shared/util/permissions';
import { superAdminAuthDetails } from '../utils/authorize-details';
import { ValidateCompanyForUniqueCodeInterceptor } from '../interceptors/validate-company-for-unique-code.interceptor';

@authenticate('jwt')
@authorize(superAdminAuthDetails)
export class CompanyController {

  constructor(
    @repository(CompanyRepository)
    public companyRepository : CompanyRepository,
    @inject.getter('repositories.UserRepository')
    private userRepositoryGetter: Getter<UserRepository>,
    @inject.context()
    public context: RequestContext,
    @inject(BindingKeys.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  @intercept(ValidateCompanyForUniqueCodeInterceptor.BINDING_KEY)
  @post(COMPANY_API)
  @response(200, {
    description: 'Company model instance',
    content: {'application/json': {schema: getModelSchemaRef(Company)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CompanyModelForCreateSchema, {
            title: 'NewCompany',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      companyS: Omit<CompanyModelForCreateSchema, 'id'>,
  ): Promise<Company> {

    const {password, ...company} = companyS;
    const companyR = await this.companyRepository.create(company);
    this.context.bind(BindingKeys.SESSION_COMPANY_CODE).to(<string>company.code.toLowerCase());
    const passwordC = await this.passwordHasher.hashPassword(password);
    const userRepository = await this.userRepositoryGetter();
    const permissions2 = {
      'user': {
        key: 'user',
        name: 'User',
        operations: {
          list: true,
          view: true,
          create: true,
          update: true,
          delete: true,
        }
      },
      ...permissions
    };
    const savedUser = await userRepository.create({
      name: company.name,
      email: company.email,
      role: 'admin',
      permissions: permissions2
    });

    // Set the password
    await userRepository
      .userCredentials(savedUser.id)
      .create({password: passwordC});
    return companyR;

  }

  @get(`${COMPANY_API}/count`)
  @response(200, {
    description: 'Company model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Company) where?: Where<Company>,
  ): Promise<Count> {

    const countR = await this.companyRepository.count(where);
    return countR;

  }

  @get(COMPANY_API)
  @response(200, {
    description: 'Array of Company model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Company, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Company) filter?: Filter<Company>,
  ): Promise<Company[]> {

    const companiesR = await this.companyRepository.find(filter);
    return companiesR;

  }

  @patch(COMPANY_API)
  @response(200, {
    description: 'Company PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {partial: true}),
        },
      },
    })
      company: Company,
    @param.where(Company) where?: Where<Company>,
  ): Promise<Count> {

    const countR = await this.companyRepository.updateAll(company, where);
    return countR;

  }

  @get(`${COMPANY_API}/{id}`)
  @response(200, {
    description: 'Company model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Company, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Company, {exclude: 'where'}) filter?: FilterExcludingWhere<Company>
  ): Promise<Company> {

    const companyR = await this.companyRepository.findById(id, filter);
    return companyR;

  }

  @patch(`${COMPANY_API}/{id}`)
  @response(204, {
    description: 'Company PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {partial: true}),
        },
      },
    })
      company: Company,
  ): Promise<void> {

    await this.companyRepository.updateById(id, company);

  }

  @put(`${COMPANY_API}/{id}`)
  @response(204, {
    description: 'Company PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() company: Company,
  ): Promise<void> {

    await this.companyRepository.replaceById(id, company);

  }

  @del(`${COMPANY_API}/{id}`)
  @response(204, {
    description: 'Company DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.companyRepository.deleteById(id);

  }


  @del(COMPANY_API)
  @response(204, {
    description: 'Companies DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Company) where?: Where<Company>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Company ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Company ids are required');

    }

    const count = await this.companyRepository.deleteAll(where);
    return count;

  }

}
