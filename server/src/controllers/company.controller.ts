import { Count, CountSchema, Filter, FilterExcludingWhere, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response } from '@loopback/rest';
import {Company} from '../models/company.model';
import { COMPANY_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { CompanyModelForCreateSchema } from '../models/company.create.model';
import {intercept} from '@loopback/context';
import { CompanyService } from '../services';
import { superAdminAuthDetails } from '../utils/authorize-details';
import { ValidateCompanyForUniqueCodeInterceptor } from '../interceptors/validate-company-for-unique-code.interceptor';
import { service } from '@loopback/core';

@authenticate('jwt')
@authorize(superAdminAuthDetails)
export class CompanyController {

  constructor(
    @service(CompanyService) public companyService: CompanyService,
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

    const lgsR = await this.companyService.create(companyS);
    return lgsR;

  }

  @get(`${COMPANY_API}/count`)
  @response(200, {
    description: 'Company model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Company) where?: Where<Company>,
  ): Promise<Count> {

    const countR = await this.companyService.count(where);
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

    const companiesR = await this.companyService.find(filter);
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

    const countR = await this.companyService.updateAll(company, where);
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

    const companyR = await this.companyService.findById(id, filter);
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

    await this.companyService.updateById(id, company);

  }

  @put(`${COMPANY_API}/{id}`)
  @response(204, {
    description: 'Company PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() company: Company,
  ): Promise<void> {

    await this.companyService.replaceById(id, company);

  }

  @del(`${COMPANY_API}/{id}`)
  @response(204, {
    description: 'Company DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.companyService.deleteById(id);

  }


  @del(COMPANY_API)
  @response(204, {
    description: 'Companies DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async deleteAll(
    @param.where(Company) where?: Where<Company>,
  ): Promise<Count> {

    const count = await this.companyService.deleteAll(where);
    return count;

  }

}
