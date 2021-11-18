import { model, property } from '@loopback/repository';
import { LedgerGroup } from './ledger-group.model';

@model({settings: {strict: false}})
export class LedgerGroupWithParents extends LedgerGroup {

    @property.array(LedgerGroup)
    parents: LedgerGroup[];

}
