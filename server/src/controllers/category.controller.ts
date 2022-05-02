/* eslint-disable max-statements */
import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, Request, Response, RestBindings, } from '@loopback/rest';
import {Category} from '../models';
import {CategoryRepository, FinYearRepository, UnitRepository} from '../repositories';
import { CATEGORY_API} from '@shared/server-apis';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { inject } from '@loopback/core';
import { BindingKeys } from '../binding.keys';
import { ProfileUser } from '../services';
import { FileUploadHandler } from '../types';
import { Save } from '../utils/save-spec';
import { CategoryImport } from '../utils/category-import-spec';
import xlsx from 'xlsx';
import {SecurityBindings} from '@loopback/security';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class CategoryController {

  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
    @repository(UnitRepository)
    public unitRepository : UnitRepository,
  ) {}

  @post(CATEGORY_API)
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  @authorize({resource: resourcePermissions.categoryCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      category: Omit<Category, 'id'>,
  ): Promise<Category> {

    const categoryR = await this.categoryRepository.create(category);
    return categoryR;

  }

  @get(`${CATEGORY_API}/count`)
  @response(200, {
    description: 'Category model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.categoryView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {

    const count = await this.categoryRepository.count(where);

    return count;

  }

  @get(CATEGORY_API)
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.categoryView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {

    const categories = await this.categoryRepository.find(filter);
    return categories;

  }

  @patch(CATEGORY_API)
  @response(200, {
    description: 'Category PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.categoryUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
      category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {

    const count = await this.categoryRepository.updateAll(category, where);
    return count;

  }

  @get(`${CATEGORY_API}/{id}`)
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.categoryView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Category, {exclude: 'where'}) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {

    const categoryR = await this.categoryRepository.findById(id, filter);
    return categoryR;

  }

  @patch(`${CATEGORY_API}/{id}`)
  @response(204, {
    description: 'Category PATCH success',
  })
  @authorize({resource: resourcePermissions.categoryUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
      category: Category,
  ): Promise<void> {

    await this.categoryRepository.updateById(id, category);

  }

  @put(`${CATEGORY_API}/{id}`)
  @response(204, {
    description: 'Category PUT success',
  })
  @authorize({resource: resourcePermissions.categoryUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() category: Category,
  ): Promise<void> {

    await this.categoryRepository.replaceById(id, category);

  }

  @del(`${CATEGORY_API}/{id}`)
  @response(204, {
    description: 'Category DELETE success',
  })
  @authorize({resource: resourcePermissions.categoryDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.categoryRepository.deleteById(id);

  }


  @del(CATEGORY_API)
  @response(204, {
    description: 'Category DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.categoryDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Category ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Category ids are required');

    }

    const count = await this.categoryRepository.deleteAll(where);
    return count;

  }

  private saveUploadedFile = (fileUploadHandler: FileUploadHandler, request: Request, response2: Response) =>
    new Promise<Save>((resolve, reject) => {

      fileUploadHandler(request, response2, (err: string) => {

        if (err) {

          reject(err);

        } else {

          resolve(CategoryController.getFilesAndFields(request));

        }


      });

    })

    private createLedgerGroup = async(categoryData:Array<CategoryImport>,
      uProfile: ProfileUser, finYearRepository : FinYearRepository)
      :Promise<void> => {

      const category:Array<CategoryImport> = [];

      for (const cData of categoryData) {

        const parentname = cData.Parent;
        const unitname = cData.Unit;
        const name = cData.Name;

        const {hsnNumber} = cData;
        const description = cData.Description;
        let unitId;
        if (unitname) {

          const pLGroup = await this.unitRepository.findOne({where: {name: unitname}});
          unitId = pLGroup?.id;

        } else {

          category.push(cData);


          continue;

        }
        let parentId;
        if (parentname) {

          const pLGroup = await this.categoryRepository.findOne({where: {name: parentname}});
          parentId = pLGroup?.id;

        } else {

          category.push(cData);


          continue;

        }

        const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
        if (!finYear) {

          throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

        }


        await this.categoryRepository.create({
          parentId,
          name,
          unitId,
          hsnNumber,
          description,

        });


      }

    }

  @post(`${CATEGORY_API}/import`, {
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
    ): Promise<CategoryImport[]> {

      await this.saveUploadedFile(fileUploadHandler, request, response2);
      const [ fileDetails ] = request.files as Array<{path: string}>;
      const savedFilePath = fileDetails.path;
      const workBook = xlsx.readFile(savedFilePath);
      const sheetNames = workBook.SheetNames;
      const categoryData:Array<CategoryImport> = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      await this.createLedgerGroup(categoryData, uProfile, finYearRepository);
      return categoryData;

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
