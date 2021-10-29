import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import {Invoice} from '../models';
import {InvoiceRepository} from '../repositories';
import { INVOICE_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class InvoiceController {

  constructor(
    @repository(InvoiceRepository)
    public invoiceRepository : InvoiceRepository,
  ) {}

  @post(INVOICE_API)
  @response(200, {
    description: 'Invoice model instance',
    content: {'application/json': {schema: getModelSchemaRef(Invoice)}},
  })
  @authorize({resource: resourcePermissions.invoiceCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Invoice, {
            title: 'NewInvoice',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      invoice: Omit<Invoice, 'id'>,
  ): Promise<Invoice> {

    const invoiceR = await this.invoiceRepository.create(invoice);
    return invoiceR;

  }

  @get(`${INVOICE_API}/count`)
  @response(200, {
    description: 'Invoice model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.invoiceView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Invoice) where?: Where<Invoice>,
  ): Promise<Count> {

    const count = await this.invoiceRepository.count(where);
    return count;

  }

  @get(INVOICE_API)
  @response(200, {
    description: 'Array of Invoice model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Invoice, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.invoiceView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Invoice) filter?: Filter<Invoice>,
  ): Promise<Invoice[]> {

    const invoices = await this.invoiceRepository.find(filter);
    return invoices;

  }

  @patch(INVOICE_API)
  @response(200, {
    description: 'Invoice PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.invoiceUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Invoice, {partial: true}),
        },
      },
    })
      invoice: Invoice,
    @param.where(Invoice) where?: Where<Invoice>,
  ): Promise<Count> {

    const count = await this.invoiceRepository.updateAll(invoice, where);
    return count;

  }

  @get(`${INVOICE_API}/{id}`)
  @response(200, {
    description: 'Invoice model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Invoice, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.invoiceView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Invoice, {exclude: 'where'}) filter?: FilterExcludingWhere<Invoice>
  ): Promise<Invoice> {

    const invoiceR = await this.invoiceRepository.findById(id, filter);
    return invoiceR;

  }

  @patch(`${INVOICE_API}/{id}`)
  @response(204, {
    description: 'Invoice PATCH success',
  })
  @authorize({resource: resourcePermissions.invoiceUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Invoice, {partial: true}),
        },
      },
    })
      invoice: Invoice,
  ): Promise<void> {

    await this.invoiceRepository.updateById(id, invoice);

  }

  @put(`${INVOICE_API}/{id}`)
  @response(204, {
    description: 'Invoice PUT success',
  })
  @authorize({resource: resourcePermissions.invoiceUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() invoice: Invoice,
  ): Promise<void> {

    await this.invoiceRepository.replaceById(id, invoice);

  }

  @del(`${INVOICE_API}/{id}`)
  @response(204, {
    description: 'Invoice DELETE success',
  })
  @authorize({resource: resourcePermissions.invoiceDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.invoiceRepository.deleteById(id);

  }

  @del(INVOICE_API)
  @response(204, {
    description: 'Invoices DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.invoiceDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Invoice) where?: Where<Invoice>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Invoice ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Invoice ids are required');

    }

    const count = await this.invoiceRepository.deleteAll(where);
    return count;

  }

}
