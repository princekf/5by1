import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, RequestContext } from '@loopback/rest';
import {FinYear} from '../models/fin-year.model';
import {FinYearRepository} from '../repositories/fin-year.repository';
import { FIN_YEAR_API } from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';
import { Getter, inject, intercept } from '@loopback/context';
import { ValidateFinYearForUniqueCodeInterceptor } from '../interceptors/validate-finyear-for-unique-code.interceptor';
import {SecurityBindings} from '@loopback/security';
import { ProfileUser } from '../services';
import { BindingKeys } from '../binding.keys';
import { defaultLedgerGroups } from '../install/default.ledgergroups';
import { BranchRepository, LedgerGroupRepository, LedgerRepository } from '../repositories';
import { Ledger, LedgerGroup } from '../models';
import { defalutLedgerGroupCodes as dlgc } from '@shared/util/ledger-group-codes';
import { defaultLedgers } from '../install/default.ledgers';
import { TransactionType } from '@shared/entity/accounting/transaction';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class FinYearController {

  constructor(
    @repository(FinYearRepository)
    public finYearRepository : FinYearRepository,
  ) {}

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

  @intercept(ValidateFinYearForUniqueCodeInterceptor.BINDING_KEY)
  @post(FIN_YEAR_API)
  @response(200, {
    description: 'FinYear model instance',
    content: {'application/json': {schema: getModelSchemaRef(FinYear)}},
  })
  @authorize({resource: resourcePermissions.finyearCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FinYear, {
            title: 'NewFinYear',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      finYear: Omit<FinYear, 'id'>,

    @inject.context() context: RequestContext,
    @repository(BranchRepository)
      branchRepository : BranchRepository,
    @inject(SecurityBindings.USER) uProfile: ProfileUser,
    @repository.getter('LedgerGroupRepository') ledgerGroupRepositoryGetter: Getter<LedgerGroupRepository>,
    @repository.getter('LedgerRepository') ledgerRepositoryGetter: Getter<LedgerRepository>,
  ): Promise<FinYear> {

    const {branchId} = finYear;
    const branch = await branchRepository.findById(branchId as string);
    if (!branch) {

      throw new Error('Please select a proper branch');

    }
    const finYearR = await this.finYearRepository.create(finYear);

    /*
     * Now install default data, like ledger groups, ledgers etc.
     */
    const finYearCode = finYear.code as string;
    const dbName = `${uProfile.company?.toLowerCase()}_${branch.code?.toLowerCase()}_${finYearCode.toLowerCase()}`;
    context.bind(BindingKeys.SESSION_DB_NAME).to(dbName);
    const ledgerGroupRepository = await ledgerGroupRepositoryGetter();
    await this.installLedgerGroups(ledgerGroupRepository);
    const ledgerRepository = await ledgerRepositoryGetter();
    await this.installLedgers(ledgerRepository, ledgerGroupRepository);
    return finYearR;

  }

  @get(`${FIN_YEAR_API}/count`)
  @response(200, {
    description: 'FinYear model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.finyearView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(FinYear) where?: Where<FinYear>,
  ): Promise<Count> {

    const countR = await this.finYearRepository.count(where);
    return countR;

  }

  @get(FIN_YEAR_API)
  @response(200, {
    description: 'Array of FinYear model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FinYear, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.finyearView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(FinYear) filter?: Filter<FinYear>,
  ): Promise<FinYear[]> {

    const finYearsR = await this.finYearRepository.find(filter);
    return finYearsR;

  }

  @patch(FIN_YEAR_API)
  @response(200, {
    description: 'FinYear PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.finyearUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FinYear, {partial: true}),
        },
      },
    })
      finYear: FinYear,
    @param.where(FinYear) where?: Where<FinYear>,
  ): Promise<Count> {

    const countR = await this.finYearRepository.updateAll(finYear, where);
    return countR;

  }

  @get(`${FIN_YEAR_API}/{id}`)
  @response(200, {
    description: 'FinYear model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FinYear, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.finyearView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FinYear, {exclude: 'where'}) filter?: FilterExcludingWhere<FinYear>
  ): Promise<FinYear> {

    const finYearR = await this.finYearRepository.findById(id, filter);
    return finYearR;

  }

  @patch(`${FIN_YEAR_API}/{id}`)
  @response(204, {
    description: 'FinYear PATCH success',
  })
  @authorize({resource: resourcePermissions.finyearUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FinYear, {partial: true}),
        },
      },
    })
      finYear: FinYear,
  ): Promise<void> {

    await this.finYearRepository.updateById(id, finYear);

  }

  @put(`${FIN_YEAR_API}/{id}`)
  @response(204, {
    description: 'FinYear PUT success',
  })
  @authorize({resource: resourcePermissions.finyearUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() finYear: FinYear,
  ): Promise<void> {

    await this.finYearRepository.replaceById(id, finYear);

  }

  @del(`${FIN_YEAR_API}/{id}`)
  @response(204, {
    description: 'FinYear DELETE success',
  })
  @authorize({resource: resourcePermissions.finyearDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.finYearRepository.deleteById(id);

  }

  @del(FIN_YEAR_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.finyearDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(FinYear) where?: Where<FinYear>,
  ): Promise<Count> {

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
