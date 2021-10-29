import { param, get, response, } from '@loopback/rest';
import { repository } from '@loopback/repository';
import { BillRepository } from '../repositories';
import { StockSummary } from '@shared/util/stock-summary';
import { STOCK_API } from '@shared/server-apis';

const stockSummarySchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      stock: {
        type: 'number'
      },
      rrp: {
        type: 'number'
      },
      mrp: {
        type: 'number'
      },
      batchNumber: {
        type: 'string'
      }
    }
  }
};

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class StockController {

  constructor(@repository(BillRepository)
  public billRepository : BillRepository,) {}

  @get(`${STOCK_API}/summary/{id}`)
  @response(200, {
    description: 'Fetching the stock summary of a product',
    content: {
      'application/json': {
        schema: stockSummarySchema,
      },
    },
  })
  @authorize({resource: resourcePermissions.stockView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
  ): Promise<Array<StockSummary>> {

    const params = [
      {'$unwind': '$purchaseItems'},
      {'$match': { 'purchaseItems.productId': { '$eq': id}}},
      {
        '$group': {
          '_id': {'batchNumber': '$purchaseItems.batchNumber',
            'mrp': '$purchaseItems.mrp'},
          'stock': {'$sum': '$purchaseItems.quantity'},
          'rrp': { '$first': '$purchaseItems.rrp' }
        }
      },
      {'$project': {
        'batchNumber': '$_id.batchNumber',
        'mrp': '$_id.mrp',
        'stock': 1,
        'rrp': 1,
        '_id': 0,
      }}
    ];
    const pQuery = await this.billRepository.dataSource.execute(this.billRepository.modelClass.name, 'aggregate', params);
    const pStocks = await pQuery.toArray();
    return pStocks;

  }

}
