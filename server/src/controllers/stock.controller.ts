import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, } from '@loopback/rest';
import { repository } from '@loopback/repository';
import { BillRepository } from '../repositories';


export class StockController {

  constructor(@repository(BillRepository)
  public billRepository : BillRepository,) {}

  @get('/inv/stock/summary/{id}')
  @response(200, {
    description: 'Fetching the stock summary of a product',
    content: {
      'application/json': {
        schema: {

        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<any> {

    const aaa = await this.billRepository.dataSource.execute();
    return {};

  }

}
