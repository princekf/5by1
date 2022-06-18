import { get, param, response } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { ACC_REPORTS_API } from '@shared/server-apis';
import { BalanceSheetItem } from '@shared/util/balance-sheet-item';
import { TrialBalanceItem } from '@shared/util/trial-balance-item';
import { LedgerReportItem } from '@shared/util/ledger-report-item';
import { BalanceSheetRespSchema, LedgerReportRespSchema, TrialBalanceLedgerSummaryRespSchema, TrialBalanceRespSchema } from './specs/common-specs';
import { AccountReportService } from '../services/account-report.service';
import { service } from '@loopback/core';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class AccountReportController {

  constructor(
    @service(AccountReportService) public accountReportService: AccountReportService,
  ) {}

  @get(`${ACC_REPORTS_API}/ledger-group-summary`)
  @response(200, {
    description: 'Ledger group summary as on a specified date. `ason` date format should be `YYYY-DD-MM` (2022-03-31)',
    content: {
      'application/json': {schema: TrialBalanceLedgerSummaryRespSchema},
    },
  })
  async ledgerGroupSummary(@param.query.date('ason') ason: Date,): Promise<TrialBalanceItem[]> {

    const lgsR = await this.accountReportService.ledgerGroupSummary(ason);
    return lgsR;

  }

  @get(`${ACC_REPORTS_API}/ledger-summary`)
  @response(200, {
    description: 'Ledger summary as on a specified date. `ason` date format should be `YYYY-DD-MM` (2022-03-31)',
    content: {
      'application/json': {schema: TrialBalanceLedgerSummaryRespSchema},
    },
  })
  async ledgerSummary(@param.query.date('ason') ason: Date,): Promise<TrialBalanceItem[]> {

    const lgsR = await this.accountReportService.generateLedgerSummary(ason);
    return lgsR;

  }

  @get(`${ACC_REPORTS_API}/ledger-group-report`)
  @response(200, {
    description: 'Ledger group report of a specified ledger',
    content: {
      'application/json': {schema: LedgerReportRespSchema},
    },
  })
  async ledgerGroupReport(
    @param.query.date('ason') ason: Date,
    @param.query.string('plid') plid: string,
  ): Promise<LedgerReportItem[]> {

    const lgsR = await this.accountReportService.generateLedgerGroupReport(ason, plid);
    return lgsR;

  }

  @get(`${ACC_REPORTS_API}/ledger-report`)
  @response(200, {
    description: 'Ledger report of a specified ledger',
    content: {
      'application/json': {schema: LedgerReportRespSchema},
    },
  })
  async ledgerReport(
    @param.query.date('ason') ason: Date,
    @param.query.string('plid') plid: string,
    @param.query.string('clid') clid?: string,
  ): Promise<LedgerReportItem[]> {

    const lgsR = await this.accountReportService.generateLedgerReport(ason, plid, clid);
    return lgsR;

  }

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


  @get(`${ACC_REPORTS_API}/trial-balance/{ason}`)
  @response(200, {
    description: 'Trial balance as on a specified date. `ason` date format should be `YYYY-DD-MM` (2022-03-31)',
    content: {
      'application/json': {schema: TrialBalanceRespSchema},
    },
  })
  async trialBalance(
    @param.path.date('ason') ason: Date,
  ): Promise<TrialBalanceItem[]> {

    const bSheet = await this.accountReportService.generateTrialBalance(ason);
    return bSheet;

  }

}
