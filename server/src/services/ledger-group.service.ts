import {injectable, BindingScope, } from '@loopback/core';
import { Count, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { Request, Response, HttpErrors } from '@loopback/rest';
import { LedgerGroup } from '../models';
import { FinYearRepository, LedgerGroupRepository } from '../repositories';
import { LedgerGroup as LedgerGroupIntf } from '@shared/entity/accounting/ledger-group';
import { LedgerGroupImport } from '../utils/ledgergroup-import-spec';
import { FileUploadHandler } from '../types';
import { ProfileUser } from './user.service';
import { Save } from '../utils/save-spec';
import xlsx from 'xlsx';

@injectable({scope: BindingScope.TRANSIENT})
export class LedgerGroupService {

  constructor(@repository(LedgerGroupRepository)
  public ledgerGroupRepository : LedgerGroupRepository,) {}


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

  private lgWithParentsAggregate = [
    {
      '$graphLookup': {
        'from': 'LedgerGroup',
        'startWith': '$parentId',
        'connectFromField': 'parentId',
        'connectToField': '_id',
        'as': 'parents'
      }
    },
    {
      '$project': {
        'id': '$_id',
        'name': '$name',
        'code': '$code',
        'parentId': '$parentId',
        'details': '$details',
        'parents': '$parents'
      }
    },
  ]

  private lgWithChildrenAggregate = [
    {
      '$graphLookup': {
        'from': 'LedgerGroup',
        'startWith': '$_id',
        'connectFromField': '_id',
        'connectToField': 'parentId',
        'maxDepth': 0,
        'as': 'children'
      }
    },
    {
      '$unwind': {
        'path': '$children',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$project': {
        '_id': 1,
        'id': '$_id',
        'name': 1,
        'code': 1,
        'parentId': 1,
        'children.id': '$children._id',
        'children.name': 1,
        'children.code': 1,
        'children.parentId': 1,
      }
    },
    {
      '$group': {
        '_id': '$_id',
        'parentId': {
          '$first': '$parentId'
        },
        'id': {
          '$first': '$id'
        },
        'name': {
          '$first': '$name'
        },
        'code': {
          '$first': '$code'
        },
        'children': {
          '$push': '$children'
        }
      }
    },
    { '$sort': { 'id': 1 } }
  ];

  private fillLDGParentMap = (ldGMap:Record<string, Array<LedgerGroupIntf>>, groups:Array<LedgerGroupIntf>) => {

    groups?.forEach((group) => {

      if (group.parentId) {

        ldGMap[group.parentId] = ldGMap[group.parentId] ?? [];
        ldGMap[group.parentId].push(group);
        this.fillLDGParentMap(ldGMap, group.children ?? []);

      }

    });

  }

  private fillWithChildren = (child: LedgerGroupIntf, ldGParentMap: Record<string, Array<LedgerGroupIntf>>) => {

    if (child.id && ldGParentMap[child.id]) {

      child.children = ldGParentMap[child.id];
      child.children.forEach((chl) => this.fillWithChildren(chl, ldGParentMap));

    }

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


  private saveUploadedFile = (fileUploadHandler: FileUploadHandler, request: Request, response2: Response) =>
    new Promise<Save>((resolve, reject) => {

      fileUploadHandler(request, response2, (err: string) => {

        if (err) {

          reject(err);

        } else {

          resolve(LedgerGroupService.getFilesAndFields(request));

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

  findLedgerGroupsWithParents = async(ldIds: Array<string>):Promise<Array<LedgerGroup>> => {

    const aggregates = [ { '$match': { '_id': { '$in': ldIds } } }, ...this.lgWithParentsAggregate ];
    const pQuery = await this.ledgerGroupRepository.execute(this.ledgerGroupRepository.modelClass.name, 'aggregate', aggregates);
    const res = <Array<LedgerGroup>> await pQuery.toArray();
    return res;

  }

  findLedgerGroupsWithChildren = async():Promise<Array<LedgerGroupIntf>> => {

    const pQuery = await this.ledgerGroupRepository.execute(this.ledgerGroupRepository.modelClass.name, 'aggregate', this.lgWithChildrenAggregate);
    const groupsWithChilds = <Array<LedgerGroupIntf>> await pQuery.toArray();
    const ldGParentMap:Record<string, Array<LedgerGroupIntf>> = {};
    this.fillLDGParentMap(ldGParentMap, groupsWithChilds);
    const rootLGs = groupsWithChilds.filter((grp) => !grp.parentId);
    rootLGs.forEach((root) => {

      root.children?.forEach((child) => {

        this.fillWithChildren(child, ldGParentMap);


      });

    });
    return rootLGs;

  }

  find = async(filter?: Filter<LedgerGroup>):Promise<LedgerGroup[]> => {

    const resp = await this.ledgerGroupRepository.find(filter);
    return resp;

  }

  create = async(ledgerGroup: Omit<LedgerGroup, 'id'>,
  ): Promise<LedgerGroup> => {


    const ledgergroupR = await this.ledgerGroupRepository.create(ledgerGroup);
    return ledgergroupR;

  }

  count = async(where?: Where<LedgerGroup>): Promise<Count> => {

    const countR = await this.ledgerGroupRepository.count(where);
    return countR;

  }

  childs = async(where?: Where<LedgerGroup>,): Promise<LedgerGroup[]> => {

    if (!where) {

      throw new HttpErrors.BadRequest('Invalid parameter : LedgerGroup codes are required');

    }
    const whereC = where as {code: {inq: Array<string>}};
    if (!whereC.code || !whereC.code.inq || whereC.code.inq.length < 1) {

      throw new HttpErrors.BadRequest('Invalid parameter : LedgerGroup codes are required');

    }
    const lgsR = await this.fetchChilds(whereC.code.inq);


    return lgsR;

  }

  updateAll = async(ledgerGroup: LedgerGroup, where?: Where<LedgerGroup>,): Promise<Count> => {

    const countR = await this.ledgerGroupRepository.updateAll(ledgerGroup, where);
    return countR;

  }

  findById = async(id: string, filter?: FilterExcludingWhere<LedgerGroup>): Promise<LedgerGroup> => {

    const lgR = await this.ledgerGroupRepository.findById(id, filter);
    return lgR;

  }

  updateById = async(id: string, ledgerGroup: LedgerGroup,): Promise<void> => {

    await this.ledgerGroupRepository.updateById(id, ledgerGroup);

  }

  replaceById = async(id: string, ledgerGroup: LedgerGroup,): Promise<void> => {

    await this.ledgerGroupRepository.replaceById(id, ledgerGroup);

  }

  deleteById = async(id: string): Promise<void> => {

    await this.ledgerGroupRepository.deleteById(id);

  }

  deleteAll = async(where?: Where<LedgerGroup>,): Promise<Count> => {

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

  async importLedgerGroup(request: Request, response2: Response, fileUploadHandler: FileUploadHandler,
    uProfile: ProfileUser, finYearRepository : FinYearRepository,
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

}
