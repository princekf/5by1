import { Component, OnInit } from '@angular/core';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { LedgergroupService } from '@fboservices/accounting/ledgergroup.service';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { VoucherType } from '@shared/entity/accounting/voucher';
import { defalutLedgerGroupNames as dlgn} from '@shared/util/ledger-group-names';
import { QueryData } from '@shared/util/query-data';

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: [ './create-purchase.component.scss' ]
})
export class CreatePurchaseComponent implements OnInit {

  primaryTransactionType = TransactionType.CREDIT;

  voucherType = VoucherType.PURCHASE;

  ledgersFiltered: Array<Ledger> = [];

  ledgersCompoundFiltered: Array<Ledger> = [];

  pLedgerGroupIds: Array<string> = [];

  cLedgerGroupIds: Array<string> = [];

  constructor(private ledgerService: LedgerService,
    private ledgergroupService: LedgergroupService) { }

  ngOnInit(): void {

    const pLGNames = [ dlgn.SUNDRY_CREDITORS, dlgn.SUNDRY_DEBTORS ];
    const cLGNames = [ dlgn.PURCHASE_ACCOUNTS ];
    const queryData:QueryData = {
      where: {
        name: {
          inq: [ ...pLGNames, ...cLGNames ]
        }
      }
    };
    this.ledgergroupService.search(queryData).subscribe((ledgerGroups) => {

      ledgerGroups.forEach((lgr) => {

        pLGNames.includes(lgr.name) ? this.pLedgerGroupIds.push(lgr.id) : this.cLedgerGroupIds.push(lgr.id);

      });

    });

  }

  public handlePrimaryLedgerChangeEvent = (ledgerQ: string):void => {

    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
      ledgerGroupId: {
        inq: this.pLedgerGroupIds
      }
    } })
      .subscribe((ledgers) => (this.ledgersFiltered = ledgers));

  };

  public handleCompoundLedgerChangeEvent = (ledgerQ: string):void => {

    this.ledgerService.search({ where: {
      name: {like: ledgerQ,
        options: 'i'},
      ledgerGroupId: {
        inq: this.cLedgerGroupIds
      }
    } })
      .subscribe((ledgers) => (this.ledgersCompoundFiltered = ledgers));

  };


}
