import { get, param, response } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { repository } from '@loopback/repository';
import { VoucherRepository } from '../repositories';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { ACC_REPORTS_API } from '@shared/server-apis';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { BalanceSheetRespSchema } from './specs/common-specs';
import { AccountReportService } from '../services/account-report.service';
import { service } from '@loopback/core';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class AccountReportController {

  constructor(
    @service(AccountReportService) public accountReportService: AccountReportService,
  ) {}


  @get(`${ACC_REPORTS_API}/balance-sheet/{ason}`)
  @response(200, {
    description: 'Balance sheet as on a specified date. `ason` date format should be `YYYY-DD-MM` (2022-03-31)',
    content: {
      'application/json': {schema: BalanceSheetRespSchema},
    },
  })
  async balanceSheet(
    @param.path.date('ason') ason: Date,
  ): Promise<BalanceSheetItem[]> {

    const bSheet = await this.accountReportService.generateBalanceSheet(ason);
    return bSheet;

  }


  @get(`${ACC_REPORTS_API}/profit-loss/{ason}`)
  @response(200, {
    description: 'Profit and loss report as on a specified date. `ason` date format should be `YYYY-DD-MM` (2022-03-31)',
    content: {
      'application/json': {schema: BalanceSheetRespSchema},
    },
  })
  async profitLoss(
    @param.path.date('ason') ason: Date,
  ): Promise<BalanceSheetItem[]> {

    const bSheet = await this.accountReportService.generateProfitLoss(ason);
    return bSheet;

  }

}
