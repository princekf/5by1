import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, Request, Response, RestBindings } from '@loopback/rest';
import {LedgerGroup} from '../models/ledger-group.model';
import {LedgerGroupRepository} from '../repositories/ledger-group.repository';
import { LEDGER_GROUP_API} from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { inject, intercept } from '@loopback/context';
import { ValidateLedgerGroupInterceptor } from '../interceptors/validate-ledgergroup.interceptor';
import { DenyDeletionOfDefaultLedgerGroup } from '../interceptors';
import { LedgerGroupWithParents } from '../models/ledger-group-with-parents.model';
import xlsx from 'xlsx';
import { BindingKeys } from '../binding.keys';
import { ProfileUser } from '../services';
import { FileUploadHandler } from '../types';
import {SecurityBindings} from '@loopback/security';
import { FinYearRepository } from '../repositories';
import { LedgerGroupImport } from '../utils/ledgergroup-import-spec';
import { Save } from '../utils/save-spec';
@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class LedgerGroupController {

  constructor(
    @repository(LedgerGroupRepository)
    public ledgerGroupRepository : LedgerGroupRepository,
  ) {}

  @intercept(ValidateLedgerGroupInterceptor.BINDING_KEY)
  @post(LEDGER_GROUP_API)
  @response(200, {
    description: 'LedgerGroup model instance',
    content: {'application/json': {schema: getModelSchemaRef(LedgerGroup)}},
  })
  @authorize({resource: resourcePermissions.ledgergroupCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LedgerGroup, {
            title: 'NewLedgerGroup',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      ledgerGroup: Omit<LedgerGroup, 'id'>,
      @inject(SecurityBindings.USER) uProfile: ProfileUser,
      @repository(FinYearRepository)
      finYearRepository : FinYearRepository,
  ): Promise<LedgerGroup> {


    const ledgergroupR = await this.ledgerGroupRepository.create(ledgerGroup);
    return ledgergroupR;

  }

  @get(`${LEDGER_GROUP_API}/count`)
  @response(200, {
    description: 'LedgerGroup model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    const countR = await this.ledgerGroupRepository.count(where);
    return countR;

  }

  @get(LEDGER_GROUP_API)
  @response(200, {
    description: 'Array of LedgerGroup model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LedgerGroup, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(LedgerGroup) filter?: Filter<LedgerGroup>,
  ): Promise<LedgerGroup[]> {

    const lgsR = await this.ledgerGroupRepository.find(filter);


    return lgsR;

  }

  private fetchChilds = async(lgCodes: Array<string>):Promise<Array<LedgerGroup>> => {

    const pQuery = await this.ledgerGroupRepository.execute(this.ledgerGroupRepository.modelClass.name, 'aggregate', [
      {
        '$graphLookup': {
          'from': 'LedgerGroup',
          'startWith': '$parentId',
          'connectFromField': 'parentId',
          'connectToField': '_id',
          'as': 'parents',
        }
      },
      {
        '$addFields': {
          'id': '$_id',
        }
      },
      {
        '$addFields': {
          'parents': {
            '$filter': {
              'input': '$parents',
              'cond': { '$in': [ '$$this.code', lgCodes ] }
            }
          }
        }
      },
      {'$match': { '$or': [
        {'parents': {'$exists': true,
          '$not': {'$size': 0}}},
        {'code': {'$in': lgCodes}}
      ]}},
    ]);


    const lgsR = <Array<LedgerGroup>> await pQuery.toArray();
    return lgsR;

  }


  @get(`${LEDGER_GROUP_API}/childs`)
  @response(200, {
    description: 'Childs of ledger groups',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LedgerGroupWithParents, {
            title: 'Ledger Groups with parents',
          }),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async childs(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<LedgerGroup[]> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const whereC = where as {code: {inq: Array<string>}};
    if (!whereC.code || !whereC.code.inq || whereC.code.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const lgsR = await this.fetchChilds(whereC.code.inq);


    return lgsR;

  }

  @patch(LEDGER_GROUP_API)
  @response(200, {
    description: 'LedgerGroup PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgergroupUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LedgerGroup, {partial: true}),
        },
      },
    })
      ledgerGroup: LedgerGroup,
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    const countR = await this.ledgerGroupRepository.updateAll(ledgerGroup, where);
    return countR;

  }

  @get(`${LEDGER_GROUP_API}/{id}`)
  @response(200, {
    description: 'LedgerGroup model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LedgerGroup, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgergroupView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(LedgerGroup, {exclude: 'where'}) filter?: FilterExcludingWhere<LedgerGroup>
  ): Promise<LedgerGroup> {

    const lgR = await this.ledgerGroupRepository.findById(id, filter);
    return lgR;

  }

  @intercept(ValidateLedgerGroupInterceptor.BINDING_KEY)
  @patch(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup PATCH success',
  })
  @authorize({resource: resourcePermissions.ledgergroupUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LedgerGroup, {partial: true}),
        },
      },
    })
      ledgerGroup: LedgerGroup,
  ): Promise<void> {

    await this.ledgerGroupRepository.updateById(id, ledgerGroup);

  }

  @intercept(ValidateLedgerGroupInterceptor.BINDING_KEY)
  @put(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup PUT success',
  })
  @authorize({resource: resourcePermissions.ledgergroupUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ledgerGroup: LedgerGroup,
  ): Promise<void> {

    await this.ledgerGroupRepository.replaceById(id, ledgerGroup);

  }


  @del(`${LEDGER_GROUP_API}/{id}`)
  @response(204, {
    description: 'LedgerGroup DELETE success',
  })
  @authorize({resource: resourcePermissions.ledgergroupDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.ledgerGroupRepository.deleteById(id);

  }

  @intercept(DenyDeletionOfDefaultLedgerGroup.BINDING_KEY)
  @del(LEDGER_GROUP_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgergroupDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(LedgerGroup) where?: Where<LedgerGroup>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }

    const count = await this.ledgerGroupRepository.deleteAll(where);
    return count;

  }

  private saveUploadedFile = (fileUploadHandler: FileUploadHandler, request: Request, response2: Response) =>
    new Promise<Save>((resolve, reject) => {

      fileUploadHandler(request, response2, (err: string) => {

        if (err) {

          reject(err);

        } else {

          resolve(LedgerGroupController.getFilesAndFields(request));

        }


      });

    })


    private createLedgerGroup = async(ledgergroupData:Array<LedgerGroupImport>,
      uProfile: ProfileUser, finYearRepository : FinYearRepository)
      :Promise<LedgerGroupImport[]> => {

      const ledger:Array<LedgerGroupImport> = [];


      for (const lgData of ledgergroupData) {


        const code = lgData.Code;
        const name = lgData.Name;
        const parentCode = lgData.ParentCode;
        const details = lgData.Details;
        let parentId;
        if (parentCode) {

          const pLGroup = await this.ledgerGroupRepository.findOne({where: {code: parentCode}});
          parentId = pLGroup?.id;

        } else {

          ledger.push(lgData);


          continue;

        }
        const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});


        if (!finYear) {

          throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');


        }

        await this.ledgerGroupRepository.create({
          code,
          name,
          parentId,
          details,
        });


      }
      return ledger;

    }

  @post(`${LEDGER_GROUP_API}/import`, {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
    async importLedgerGroup(
    @requestBody.file()
      request: Request,
    @inject(RestBindings.Http.RESPONSE) response2: Response,
    @inject(BindingKeys.FILE_UPLOAD_SERVICE) fileUploadHandler: FileUploadHandler,
    @inject(SecurityBindings.USER) uProfile: ProfileUser,
    @repository(FinYearRepository) finYearRepository : FinYearRepository,
    ): Promise<LedgerGroupImport[]> {

      await this.saveUploadedFile(fileUploadHandler, request, response2);
      const [ fileDetails ] = request.files as Array<{path: string}>;
      const savedFilePath = fileDetails.path;
      const workBook = xlsx.readFile(savedFilePath);
      const sheetNames = workBook.SheetNames;
      const ledgergroupData:Array<LedgerGroupImport> = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      const ledgergroupi = await this.createLedgerGroup(ledgergroupData, uProfile, finYearRepository);
      return ledgergroupi;

    }


  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static getFilesAndFields(request: Request) {

    const uploadedFiles = request.files;
    const mapper = (file2: globalThis.Express.Multer.File) => ({
      fieldname: file2.fieldname,
      originalname: file2.originalname,
      encoding: file2.encoding,
      mimetype: file2.mimetype,
      size: file2.size,
    });
    let files = [];
    if (Array.isArray(uploadedFiles)) {

      files = uploadedFiles.map(mapper);

    } else {

      for (const filename in uploadedFiles) {

        if (!uploadedFiles.hasOwnProperty(filename)) {

          continue;

        }

        files.push(...uploadedFiles[filename].map(mapper));

      }

    }
    return {files,
      fields: request.body};

  }

}
