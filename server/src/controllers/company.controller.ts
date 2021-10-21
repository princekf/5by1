import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response } from '@loopback/rest';
import {Company} from '../models';
import {CompanyRepository} from '../repositories';
import { COMPANY_API } from '@shared/server-apis';

export class CompanyController {

  constructor(
    @repository(CompanyRepository)
    public companyRepository : CompanyRepository,
  ) {}

  @post(COMPANY_API)
  @response(200, {
    description: 'Company model instance',
    content: {'application/json': {schema: getModelSchemaRef(Company)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            title: 'NewCompany',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      company: Omit<Company, 'id'>,
  ): Promise<Company> {

    const companyR = await this.companyRepository.create(company);
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

}
