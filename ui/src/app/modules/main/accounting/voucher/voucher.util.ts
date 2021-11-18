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
  return [ pLedgerGroupIds, cLedgerGroupIds ];

};
