import { VoucherService } from '@fboservices/accounting/voucher.service';
import { LedgerGroup } from '@shared/entity/accounting/ledger-group';


export const findLedgerIdsIncludingChilds =
  (pLGNames: Array<string>, ledgerGroups: Array<LedgerGroup>): Array<string> => {

    const pLedgerGroupIds: Array<string> = [];
    ledgerGroups.forEach((lgr) => {

      if (pLGNames.includes(lgr.code)) {

        pLedgerGroupIds.push(lgr.id);

      }
      lgr.parents?.forEach((lgrp) => {

        if (pLGNames.includes(lgrp.code)) {

          pLedgerGroupIds.push(lgr.id);

        }

      });

    });
    return pLedgerGroupIds;

  };

export const findLedgerIdsIncludingChilds2 =
  (pLGNames: Array<string>, cLGNames: Array<string>, lGr: Array<LedgerGroup>): [Array<string>, Array<string>] => {

    const pLedgerGroupIds: Array<string> = [];
    const cLedgerGroupIds: Array<string> = [];

    lGr.forEach((lgr) => {

      if (pLGNames.includes(lgr.code)) {

        pLedgerGroupIds.push(lgr.id);

      }
      if (cLGNames.includes(lgr.code)) {

        cLedgerGroupIds.push(lgr.id);

      }
      lgr.parents?.forEach((lgrp) => {

        if (pLGNames.includes(lgrp.code)) {

          pLedgerGroupIds.push(lgr.id);

        }
        if (cLGNames.includes(lgrp.code)) {

          cLedgerGroupIds.push(lgr.id);

        }

      });

    });
    return [pLedgerGroupIds, cLedgerGroupIds];

  };

export const handleImportVouchers = (file: File, loading: { status: boolean }, voucherService: VoucherService): void => {

  loading.status = true;
  voucherService.importVouchers(file).subscribe(() => {
    
    loading.status = false;
    console.log('file uploaded');

  },
  (err) => {
    
    loading.status = false;
    console.error(err);

  });

}
