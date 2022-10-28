import {injectable, BindingScope, Getter} from '@loopback/core';
import { Count, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { HttpErrors, RequestContext } from '@loopback/rest';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { BindingKeys } from '../binding.keys';
import { Branch, FinYear, Ledger, LedgerGroup } from '../models';
import { BranchRepository, FinYearRepository, LedgerGroupRepository, LedgerRepository } from '../repositories';
import { FinYearTC } from '../utils/fin-year-tc';
import { ProfileUser } from './user.service';
import { defaultLedgerGroups } from '../install/default.ledgergroups';
import { defalutLedgerGroupCodes as dlgc } from '@shared/util/ledger-group-codes';
import { defaultLedgers } from '../install/default.ledgers';
import dayjs from 'dayjs';

@injectable({scope: BindingScope.TRANSIENT})
export class FinyearService {

  constructor(@repository(FinYearRepository)
    public finYearRepository : FinYearRepository,) {}

    private findRefYearMasterItems =
    async(refFinYearId: string, uProfile: ProfileUser, branch: Branch, context: RequestContext,
      lGRepoGtr: Getter<LedgerGroupRepository>, ldgRepoGtr: Getter<LedgerRepository>,)
      :Promise<[refLGsM: LedgerGroup[], refLedgsM: Ledger[]]> => {

      const refFinYear = await this.finYearRepository.findById(refFinYearId);
      const refDbName = `${uProfile.company?.toLowerCase()}_${branch.code?.toLowerCase()}_${refFinYear.code.toLowerCase()}`;
      context.bind(BindingKeys.SESSION_DB_NAME).to(refDbName);
      const ledgerGroupRepository = await lGRepoGtr();
      const ledgerRepository = await ldgRepoGtr();
      const refLGsM = await ledgerGroupRepository.find();
      const refLedgsM = await ledgerRepository.find();
      return [ refLGsM, refLedgsM ];


    }

    private createLGFromRefArray = async(refLGsM: LedgerGroup[], finYearR: FinYear, uProfile: ProfileUser,
      branch: Branch, context: RequestContext, lGRepoGtr: Getter<LedgerGroupRepository>,)
      :Promise<Record<string, string>> => {

      const finYearCode = finYearR.code as string;
      const dbName = `${uProfile.company?.toLowerCase()}_${branch.code?.toLowerCase()}_${finYearCode.toLowerCase()}`;
      context.bind(BindingKeys.SESSION_DB_NAME).to(dbName);
      const ledgerGroupRepository = await lGRepoGtr();
      const newCodeLGMap:Record<string, string> = {};
      const oldLGtoNewLG:Record<string, string> = {};
      const codePIdMap:Record<string, string> = {};
      const idCodeMap:Record<string, string> = {};
      const lgCodes: string[] = [];
      for (const refLGT of refLGsM) {

        const {name, code, details, id, parentId} = refLGT;
        idCodeMap[id] = code;
        if (parentId) {

          codePIdMap[code] = parentId;
          lgCodes.push(code);

        }
        const nLG = await ledgerGroupRepository.create({name,
          code,
          details});
        newCodeLGMap[nLG.code] = nLG.id;
        oldLGtoNewLG[id] = nLG.id;

      }

      lgCodes.forEach(async(code) => {

        const oParent = codePIdMap[code];
        const nLGId = newCodeLGMap[code];
        const parentCode = idCodeMap[oParent];
        const newParentLG = newCodeLGMap[parentCode];
        await ledgerGroupRepository.updateById(nLGId, {parentId: newParentLG});

      });
      return oldLGtoNewLG;

    }

    private saveMasterItemsFromReference = async(refFinYearId: string, finYearR: FinYear, uProfile: ProfileUser,
      branch: Branch, context: RequestContext, lGRepoGtr: Getter<LedgerGroupRepository>,
      ldgRepoGtr: Getter<LedgerRepository>,) => {

      const [ refLGsM, refLedgsM ] =
      await this.findRefYearMasterItems(refFinYearId, uProfile, branch, context, lGRepoGtr, ldgRepoGtr);
      const oldLGtoNewLG = await this.createLGFromRefArray(refLGsM, finYearR, uProfile, branch, context, lGRepoGtr);


      const ledgerRepository = await ldgRepoGtr();

      for (const refLdg of refLedgsM) {

        const {name, code, details, ledgerGroupId} = refLdg;
        const obAmount = 0;
        const obType = 'Credit';
        const newLGId = oldLGtoNewLG[ledgerGroupId];
        ledgerRepository.create({
          name,
          code,
          details,
          ledgerGroupId: newLGId,
          obAmount,
          obType
        });

      }

    }

    private installLedgerGroups = async(ledgerGroupRepository : LedgerGroupRepository) => {

      const dLGs = [ ...defaultLedgerGroups ];
      const pGroups = dLGs.filter((dLG) => !dLG.parent) as Array<LedgerGroup>;
      const pGroupsSaved = await ledgerGroupRepository.createAll(pGroups);
      const pGrpMap:Record<string, string> = {};
      pGroupsSaved.forEach((pGrp) => (pGrpMap[pGrp.code] = pGrp.id));
      const sGroups = dLGs.filter((dLG) => dLG.parent) as Array<LedgerGroup>;
      const sGroups2:Array<LedgerGroup> = [];
      const sGroups3:Array<LedgerGroup> = [];
      sGroups.forEach((sGrp) => {

        const {name, code, parent, extras} = sGrp;
        if (pGrpMap[parent?.code]) {

          sGroups2.push({
            name,
            code,
            parentId: pGrpMap[parent.code],
            extras
          } as LedgerGroup & {extras : unknown});

        } else {

          sGroups3.push({
            name,
            code,
            parent,
            extras
          } as LedgerGroup & {extras : unknown});

        }

      });
      const s2GroupSaved = await ledgerGroupRepository.createAll(sGroups2);
      s2GroupSaved.forEach((pGrp) => (pGrpMap[pGrp.code] = pGrp.id));
      const sGroups4:Array<LedgerGroup> = [];
      sGroups3.forEach((sGrp) => {

        const {name, code, parent, extras} = sGrp;
        sGroups4.push({
          name,
          code,
          parentId: pGrpMap[parent.code],
          extras
        } as LedgerGroup & {extras : unknown});

      });

      await ledgerGroupRepository.createAll(sGroups4);

    };

    private installLedgers =
    async(ledgerRepository : LedgerRepository, ledgerGroupRepository : LedgerGroupRepository) => {

      const lGroups = await ledgerGroupRepository.find({where: {code: {inq: [ dlgc.LIABILITIES, dlgc.CACH_IN_HAND ]}}});
      const lGroupMap:Record<string, string> = {};
      lGroups.forEach((lgrp) => (lGroupMap[lgrp.code] = lgrp.id));

      const ledgers:Array<Ledger> = [];
      defaultLedgers.forEach((ldg) => {

        const {name, code, ledgerGroup} = ldg;
        ledgers.push({name,
          code,
          ledgerGroupId: lGroupMap[ledgerGroup?.code ?? ''],
          obAmount: 0,
          obType: TransactionType.CREDIT} as Ledger);

      });
      await ledgerRepository.createAll(ledgers);

    };

    private validateCreateInputs = async(finYear: FinYearTC, branch: Branch) => {

      if (!branch) {

        throw new Error('Please select a proper branch');

      }

      const finStart = dayjs(finYear.startDate);
      const finEndCalc = finStart.add(1, 'year').subtract(1, 'day');
      const finEnd = dayjs(finYear.endDate);
      if (finEndCalc.date() !== finEnd.date() || finEndCalc.month() !== finEnd.month()
      || finEndCalc.year() !== finEnd.year()) {

        throw new Error('Financial year should be a full year.');

      }
      const fSD = branch.finYearStartDate;
      if (finStart.date() !== fSD.getDate() || finStart.month() !== fSD.getMonth()) {

        throw new Error('Start date should match with branch configurations.');

      }
      const finYears = await this.finYearRepository.find();
      finYears.forEach((finYearC) => {

        const fsDC = finYearC.startDate;
        if (finStart.date() === fsDC.getDate() && finStart.month() === fsDC.getMonth()
        && finStart.year() === fsDC.getFullYear()) {

          throw new Error('Financial year already exists for the selected date range.');

        }

      });

    }

    async create(
      finYear: Omit<FinYearTC, 'id'>,
      context: RequestContext,
      branchRepository : BranchRepository,
      uProfile: ProfileUser,
      lGRepoGtr: Getter<LedgerGroupRepository>,
      ldgRepoGtr: Getter<LedgerRepository>,
    ): Promise<FinYear> {


      const {branchId} = finYear;
      const branch = await branchRepository.findById(branchId as string);
      await this.validateCreateInputs(finYear as FinYearTC, branch);
      const finYearR = await this.finYearRepository.create(finYear);
      if (finYear.refFinYearId) {

        const refFinId = finYear.refFinYearId as string;
        await this.saveMasterItemsFromReference(refFinId, finYearR, uProfile, branch, context, lGRepoGtr, ldgRepoGtr);

      } else {

        const finYearCode = finYear.code as string;
        const dbName = `${uProfile.company?.toLowerCase()}_${branch.code?.toLowerCase()}_${finYearCode.toLowerCase()}`;
        context.bind(BindingKeys.SESSION_DB_NAME).to(dbName);
        const ledgerGroupRepository = await lGRepoGtr();
        const ledgerRepository = await ldgRepoGtr();
        await this.installLedgerGroups(ledgerGroupRepository);
        await this.installLedgers(ledgerRepository, ledgerGroupRepository);

      }
      return finYearR;

    }

    count = async(
      where?: Where<FinYear>,
    ): Promise<Count> => {

      const countR = await this.finYearRepository.count(where);
      return countR;

    }

    find = async(
      filter?: Filter<FinYear>,
    ): Promise<FinYear[]> => {

      const finYearsR = await this.finYearRepository.find(filter);
      return finYearsR;

    }

    updateAll = async(finYear: FinYear, where?: Where<FinYear>,
    ): Promise<Count> => {

      const countR = await this.finYearRepository.updateAll(finYear, where);
      return countR;

    }

    findById = async(id: string, filter?: FilterExcludingWhere<FinYear>): Promise<FinYear> => {

      const finYearR = await this.finYearRepository.findById(id, filter);
      return finYearR;

    }

    updateById = async(id: string, finYear: FinYear,
    ): Promise<void> => {

      await this.finYearRepository.updateById(id, finYear);

    }

    replaceById = async(id: string, finYear: FinYear,): Promise<void> => {

      await this.finYearRepository.replaceById(id, finYear);

    }

    deleteById = async(id: string): Promise<void> => {

      await this.finYearRepository.deleteById(id);

    }

    deleteAll = async(where?: Where<FinYear>,): Promise<Count> => {

      if (!where) {

        throw new HttpErrors.Conflict('Invalid parameter : FinYear ids are required');

      }
      const whereC = where as {id: {inq: Array<string>}};
      if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

        throw new HttpErrors.Conflict('Invalid parameter : FinYear ids are required');

      }

      const count = await this.finYearRepository.deleteAll(where);
      return count;

    }

}
