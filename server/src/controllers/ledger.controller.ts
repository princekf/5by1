import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, Request, Response, RestBindings} from '@loopback/rest';
import {Ledger} from '../models';
import {FinYearRepository, LedgerRepository} from '../repositories';
import { LEDGER_API} from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';
import { ValidateLedgerInterceptor } from '../interceptors/validate-ledger.interceptor';
import { intercept } from '@loopback/context';
import { inject } from '@loopback/core';
import {SecurityBindings} from '@loopback/security';
import { ProfileUser } from '../services';
import { FileUploadHandler } from '../types';

import xlsx from 'xlsx';
import { BindingKeys } from '../binding.keys';
import { LedgerImport } from '../utils/ledger-import-specs';
@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class LedgerController {

  constructor(
    @repository(LedgerRepository)
    public ledgerRepository : LedgerRepository,
  ) {}

  @intercept(ValidateLedgerInterceptor.BINDING_KEY)
  @post(LEDGER_API)
  @response(200, {
    description: 'Ledger model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ledger)}},
  })
  @authorize({resource: resourcePermissions.ledgerCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {
            title: 'NewLedger',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      ledger: Omit<Ledger, 'id'>,
      @inject(SecurityBindings.USER) uProfile: ProfileUser,
      @repository(FinYearRepository)
      finYearRepository : FinYearRepository,
  ): Promise<Ledger> {

    const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
    if (!finYear) {

      throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

    }
    const otherDetails = finYear.extras as {lastVNo:number};
    const lastVNo = otherDetails?.lastVNo ?? 0;
    const nextVNo = lastVNo + 1;
    const nextVNoS = `${uProfile.company}/${uProfile.branch}/${uProfile.finYear}/${nextVNo}`.toUpperCase();
    ledger.number = nextVNoS;
    const lgR = await this.ledgerRepository.create(ledger);
    await finYearRepository.updateById(finYear.id, {extras: {lastVNo: nextVNo}});
    return lgR;

  }

  @get(`${LEDGER_API}/count`)
  @response(200, {
    description: 'Ledger model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgerView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {

    const countR = await this.ledgerRepository.count(where);
    return countR;

  }

  @get(LEDGER_API)
  @response(200, {
    description: 'Array of Ledger model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ledger, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgerView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Ledger) filter?: Filter<Ledger>,
  ): Promise<Ledger[]> {

    const lgsR = await this.ledgerRepository.find(filter);
    return lgsR;

  }

  @patch(LEDGER_API)
  @response(200, {
    description: 'Ledger PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgerUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
      ledger: Ledger,
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {

    const countR = await this.ledgerRepository.updateAll(ledger, where);
    return countR;

  }

  @get(`${LEDGER_API}/{id}`)
  @response(200, {
    description: 'Ledger model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ledger, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.ledgerView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Ledger, {exclude: 'where'}) filter?: FilterExcludingWhere<Ledger>
  ): Promise<Ledger> {

    const lgR = await this.ledgerRepository.findById(id, filter);
    return lgR;

  }

  @patch(`${LEDGER_API}/{id}`)
  @response(204, {
    description: 'Ledger PATCH success',
  })
  @authorize({resource: resourcePermissions.ledgerUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
      ledger: Ledger,
  ): Promise<void> {

    await this.ledgerRepository.updateById(id, ledger);

  }

  @intercept(ValidateLedgerInterceptor.BINDING_KEY)
  @put(`${LEDGER_API}/{id}`)
  @response(204, {
    description: 'Ledger PUT success',
  })
  @authorize({resource: resourcePermissions.ledgerUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ledger: Ledger,
  ): Promise<void> {

    await this.ledgerRepository.replaceById(id, ledger);

  }

  @del(`${LEDGER_API}/{id}`)
  @response(204, {
    description: 'Ledger DELETE success',
  })
  @authorize({resource: resourcePermissions.ledgerDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.ledgerRepository.deleteById(id);

  }


  @del(LEDGER_API)
  @response(204, {
    description: 'Branchs DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.ledgerDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : LedgerGroup ids are required');

    }

    const count = await this.ledgerRepository.deleteAll(where);
    return count;

  }

  private saveUploadedFile = (fileUploadHandler: FileUploadHandler, request: Request, response2: Response) =>
    new Promise<unknown>((resolve, reject) => {

      fileUploadHandler(request, response2, (err: unknown) => {

        if (err) {

          reject(err);

        } else {

          resolve(LedgerController.getFilesAndFields(request));

        }


      });

    })

  private createLedger = async(ledgerData:Array<LedgerImport>,
    uProfile: ProfileUser, finYearRepository : FinYearRepository)
    :Promise<void> => {

    for (const lgData of ledgerData) {

      const name = lgData.Name;
      const code = lgData.Code;


      const obAmount = lgData.OpeningBalance;

      const obType = lgData.OpeningType;

      const details = lgData.Details;


      const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});

      if (!finYear) {

        throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

      }
      const otherDetails = finYear.extras as {lastVNo:number};
      const lastVNo = otherDetails?.lastVNo ?? 0;
      const nextVNo = lastVNo + 1;
      const nextVNoS = `${uProfile.company}/${uProfile.branch}/${uProfile.finYear}/${nextVNo}`.toUpperCase();

      if (!finYear) {

        throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

      }


      await this.ledgerRepository.create({
        name,
        code,

        obAmount,
        obType,
        number: nextVNoS,
        details,
      });


    }

  }

@post(`${LEDGER_API}/import`, {
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
  async importLedger(
  @requestBody.file()
    request: Request,
  @inject(RestBindings.Http.RESPONSE) response2: Response,
  @inject(BindingKeys.FILE_UPLOAD_SERVICE) fileUploadHandler: FileUploadHandler,
  @inject(SecurityBindings.USER) uProfile: ProfileUser,
  @repository(FinYearRepository) finYearRepository : FinYearRepository,
  ): Promise<unknown> {

    await this.saveUploadedFile(fileUploadHandler, request, response2);
    const [ fileDetails ] = request.files as Array<{path: string}>;
    const savedFilePath = fileDetails.path;
    const workBook = xlsx.readFile(savedFilePath);
    const sheetNames = workBook.SheetNames;
    const ledgerData:Array<LedgerImport> = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
    await this.createLedger(ledgerData, uProfile, finYearRepository);
    return ledgerData;

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
