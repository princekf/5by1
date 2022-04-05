import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, Request, Response, RestBindings, } from '@loopback/rest';
import {Product} from '../models';
import {CategoryRepository, FinYearRepository, ProductRepository} from '../repositories';
import { PRODUCT_API} from '@shared/server-apis';
import { ArrayReponse } from '../models/util/array-resp.model';
import { ArrayResponse as ArrayReponseInft } from '@shared/util/array-resp';

import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails } from '../utils/autherize-details';
import { inject } from '@loopback/core';
import { BindingKeys } from '../binding.keys';
import { ProfileUser } from '../services';
import { FileUploadHandler } from '../types';
import { Save } from '../utils/save-spec';
import { ProductImport } from '../utils/product-import-specs';
import xlsx from 'xlsx';
import {SecurityBindings} from '@loopback/security';


@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class ProductController {

  constructor(
    @repository(ProductRepository)
    public productRepository : ProductRepository,
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
  ) {}

  @post(PRODUCT_API)
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  @authorize({resource: resourcePermissions.productCreate.name,
    ...adminAndUserAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      product: Omit<Product, 'id'>,
  ): Promise<Product> {

    const productR = await this.productRepository.create(product);
    return productR;

  }

  @get(`${PRODUCT_API}/distinct/{column}`)
  @response(200, {
    description: 'Tax model group names',
    content: {'application/json': {schema: ArrayReponse}},
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async distinct(
    @param.path.string('column') column: string,
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<ArrayReponseInft> {

    const resp = await this.productRepository.distinct(column, filter);
    return resp;

  }

  @get(`${PRODUCT_API}/count`)
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async count(
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {

    const count = await this.productRepository.count(where);
    return count;

  }

  @get(PRODUCT_API)
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {

    const products = await this.productRepository.find(filter);
    return products;

  }

  @patch(PRODUCT_API)
  @response(200, {
    description: 'Product PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.productUpdate.name,
    ...adminAndUserAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {

    const count = await this.productRepository.updateAll(product, where);
    return count;

  }

  @get(`${PRODUCT_API}/{id}`)
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.productView.name,
    ...adminAndUserAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'}) filter?: FilterExcludingWhere<Product>
  ): Promise<Product> {

    const productR = await this.productRepository.findById(id, filter);
    return productR;

  }

  @patch(`${PRODUCT_API}/{id}`)
  @response(204, {
    description: 'Product PATCH success',
  })
  @authorize({resource: resourcePermissions.productUpdate.name,
    ...adminAndUserAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
  ): Promise<void> {

    await this.productRepository.updateById(id, product);

  }

  @put(`${PRODUCT_API}/{id}`)
  @response(204, {
    description: 'Product PUT success',
  })
  @authorize({resource: resourcePermissions.productUpdate.name,
    ...adminAndUserAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Product,
  ): Promise<void> {

    await this.productRepository.replaceById(id, product);

  }

  @del(`${PRODUCT_API}/{id}`)
  @response(204, {
    description: 'Product DELETE success',
  })
  @authorize({resource: resourcePermissions.productDelete.name,
    ...adminAndUserAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.productRepository.deleteById(id);

  }

  @del(PRODUCT_API)
  @response(204, {
    description: 'Products DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.productDelete.name,
    ...adminAndUserAuthDetails})
  async deleteAll(
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Product ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Product ids are required');

    }

    const count = await this.productRepository.deleteAll(where);
    return count;

  }

  private saveUploadedFile = (fileUploadHandler: FileUploadHandler, request: Request, response2: Response) =>
    new Promise<Save>((resolve, reject) => {

      fileUploadHandler(request, response2, (err: string) => {

        if (err) {

          reject(err);

        } else {

          resolve(ProductController.getFilesAndFields(request));

        }


      });

    })

    private createLedgerGroup = async(productData:Array<ProductImport>,
      uProfile: ProfileUser, finYearRepository : FinYearRepository)
      :Promise<void> => {

      const product:Array<ProductImport> = [];

      for (const pData of productData) {


        const code = pData.Code;
        const name = pData.Name;
        const brand = pData.Brand;
        const barcode = pData.Barcode;
        const location = pData.Location;
        const reorderLevel = pData.ReOrder;
        const categoryname = pData.Category;
        const status = pData.Status;
        let categoryId;
        if (categoryname) {

          const pLGroup = await this.categoryRepository.findOne({where: {name: categoryname}});
          categoryId = pLGroup?.id;

        } else {

          product.push(pData);


          continue;

        }
        const finYear = await finYearRepository.findOne({where: {code: {regexp: `/^${uProfile.finYear}$/i`}}});
        if (!finYear) {

          throw new HttpErrors.UnprocessableEntity('Please select a proper financial year.');

        }


        await this.productRepository.create({
          code,
          name,
          brand,
          barcode,
          location,
          categoryId,
          reorderLevel,
          status,
        });


      }

    }

  @post(`${PRODUCT_API}/import`, {
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
    ): Promise<ProductImport[]> {

      await this.saveUploadedFile(fileUploadHandler, request, response2);
      const [ fileDetails ] = request.files as Array<{path: string}>;
      const savedFilePath = fileDetails.path;
      const workBook = xlsx.readFile(savedFilePath);
      const sheetNames = workBook.SheetNames;
      const productData:Array<ProductImport> = xlsx.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      await this.createLedgerGroup(productData, uProfile, finYearRepository);
      return productData;

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
