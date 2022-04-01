import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post,
  param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, Request, Response, RestBindings, } from '@loopback/rest';
import {Bank} from '../models';
import {BankRepository, FinYearRepository} from '../repositories';
import { BANK_API} from '@shared/server-apis';
import { authenticate } from '@loopback/authentication';
import { authorize, } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';
import { inject } from '@loopback/core';
import { BindingKeys } from '../binding.keys';
import { ProfileUser } from '../services';
import { FileUploadHandler } from '../types';
import xlsx from 'xlsx';
import {SecurityBindings} from '@loopback/security';
import { Save } from '../utils/save-spec';
import { BankImport } from '../utils/bank-import-specs';


@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class BankController {

  constructor(
    @repository(BankRepository)
    public bankRepository : BankRepository,
  ) {}

  @post(BANK_API)
  @response(200, {
    description: 'Bank model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bank)}},
  })
  @authorize({resource: resourcePermissions.bankCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bank, {
            title: 'NewBank',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      bank: Omit<Bank, 'id'>,
  ): Promise<Bank> {

    const bankR = await this.bankRepository.create(bank);
    return bankR;

  }

  @get(`${BANK_API}/count`)
  @response(200, {
    description: 'Bank model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.bankView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Bank) where?: Where<Bank>,
  ): Promise<Count> {

    const count = await this.bankRepository.count(where);
    return count;

  }

  @get(BANK_API)
  @response(200, {
    description: 'Array of Bank model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bank, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.bankView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Bank) filter?: Filter<Bank>,
  ): Promise<Bank[]> {

    const banks = await this.bankRepository.find(filter);
    return banks;

  }

  @patch(BANK_API)
  @response(200, {
    description: 'Bank PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.bankUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bank, {partial: true}),
        },
      },
    })
      bank: Bank,
    @param.where(Bank) where?: Where<Bank>,
  ): Promise<Count> {

    const count = await this.bankRepository.updateAll(bank, where);
    return count;

  }

  @get(`${BANK_API}/{id}`)
  @response(200, {
    description: 'Bank model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bank, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.bankView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Bank, {exclude: 'where'}) filter?: FilterExcludingWhere<Bank>
  ): Promise<Bank> {

    const bankR = await this.bankRepository.findById(id, filter);
    return bankR;

  }

  @patch(`${BANK_API}/{id}`)
  @response(204, {
    description: 'Bank PATCH success',
  })
  @authorize({resource: resourcePermissions.bankUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bank, {partial: true}),
        },
      },
    })
      bank: Bank,
  ): Promise<void> {

    await this.bankRepository.updateById(id, bank);

  }

  @put(`${BANK_API}/{id}`)
  @response(204, {
    description: 'Bank PUT success',
  })
  @authorize({resource: resourcePermissions.bankUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bank: Bank,
  ): Promise<void> {

    await this.bankRepository.replaceById(id, bank);

  }

  @del(`${BANK_API}/{id}`)
  @response(204, {
    description: 'Bank DELETE success',
  })
  @authorize({resource: resourcePermissions.bankDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.bankRepository.deleteById(id);

  }

  @del(BANK_API)
  @response(204, {
    description: 'Banks DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.bankDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Bank) where?: Where<Bank>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Bank ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Bank ids are required');

    }

    const count = await this.bankRepository.deleteAll(where);
    return count;

  }

  private saveUploadedFile = (fileUploadHandler: FileUploadHandler, request: Request, response2: Response) =>
    new Promise<Save>((resolve, reject) => {

      fileUploadHandler(request, response2, (err: string) => {

        if (err) {

          reject(err);

        } else {

          resolve(BankController.getFilesAndFields(request));

        }


      });

    })

    private createLedgerGroup = async(bankData:Array<BankImport>,
      uProfile: ProfileUser, finYearRepository : FinYearRepository)
      :Promise<void> => {


      for (const bData of bankData) {

        const type = bData.Type;

        const name = bData.Name;
        const description = bData.Description;

        const openingBalance = bData.OpeningBalance;

        const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
        if (!finYear) {

          throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

        }


        await this.bankRepository.create({
          type,
          name,
          openingBalance,
          description,

        });


      }

    }

  @post(`${BANK_API}/import`, {
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
    ): Promise<BankImport[]> {

      await this.saveUploadedFile(fileUploadHandler, request, response2);
      const [ fileDetails ] = request.files as Array<{path: string}>;
      const savedFilePath = fileDetails.path;
      const workBook = xlsx.readFile(savedFilePath);
      const sheetNames = workBook.SheetNames;
      const bankData:Array<BankImport> = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      await this.createLedgerGroup(bankData, uProfile, finYearRepository);
      return bankData;

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
