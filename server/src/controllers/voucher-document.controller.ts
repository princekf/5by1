import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, del, requestBody, getWhereSchemaFor } from '@loopback/rest';
import { Voucher,
  Document} from '../models';
import {VoucherRepository} from '../repositories';
import { VOUCHER_API } from '@shared/server-apis';
import { Document as DocumentIntf } from '@shared/entity/common/document';
import { inject } from '@loopback/core';
import { ProfileUser } from '../services';
import {SecurityBindings} from '@loopback/security';
import { fboServerUtil } from '../utils/fbo-server-util';
import { DocumentResp } from '../utils/document.resp';
import { awsPreSignedUrlUtil } from '../utils/aws-pre-signed-url.util';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class VoucherDocumentController {

  constructor(
    @repository(VoucherRepository) protected voucherRepository: VoucherRepository,
  ) { }

  @get(`${VOUCHER_API}/{id}/documents`, {
    responses: {
      '200': {
        description: 'Array of Voucher has many Document through VoucherDocument',
        content: {
          'application/json': {
            schema: {type: 'array',
              items: getModelSchemaRef(Document)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Document>,
  ): Promise<Document[]> {

    const documents = await this.voucherRepository.documents(id).find(filter);
    return documents;

  }

  @get(`${VOUCHER_API}/{vid}/{did}/signed-url`, {
    responses: {
      '200': {
        description: 'Signed get url for the attatched document.',
        content: {'application/json': {schema: {
          type: 'object',
          title: 'string',
          'x-typescript-type': 'string',
          properties: {
            signedURL: {
              type: 'string'
            }
          }
        }}},
      },
    },
  })
  async signedURL(
    @param.path.string('vid') vid: string,
    @param.path.string('did') did: string,
  ): Promise<{signedURL: string}> {

    const documents = await this.voucherRepository.documents(vid).find({where: {
      id: {
        eq: did
      }
    }});
    const [ doc ] = documents;
    if (!doc?.key) {

      return {signedURL: ''};

    }
    const signedURL = await awsPreSignedUrlUtil.createTemporarySignedGETUrl(doc.key);
    return {signedURL};

  }

  @post(`${VOUCHER_API}/{id}/documents`, {
    responses: {
      '200': {
        description: 'create a Document model instance',
        content: {'application/json': {schema: getModelSchemaRef(Document)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Voucher.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {
            title: 'NewDocumentInVoucher',
            exclude: [ 'id' ],
          }),
        },
      },
    }) document: Omit<Document, 'id'>,
    @inject(SecurityBindings.USER) uProfile: ProfileUser,
  ): Promise<DocumentIntf> {

    const {company, branch, finYear} = uProfile;
    const key = `${company}/${branch}/${finYear}/${fboServerUtil.generateRadomString()}-${document.name}`;
    document.key = key;
    const doc: DocumentResp = await this.voucherRepository.documents(id).create(document);
    const putURL = await awsPreSignedUrlUtil.createTemporarySignedPUTUrl(key);
    return {...doc,
      putURL};


  }

  @patch(`${VOUCHER_API}/{id}/documents`, {
    responses: {
      '200': {
        description: 'Voucher.Document PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
      document: Partial<Document>,
    @param.query.object('where', getWhereSchemaFor(Document)) where?: Where<Document>,
  ): Promise<Count> {

    const count = await this.voucherRepository.documents(id).patch(document, where);
    return count;

  }

  @del(`${VOUCHER_API}/{id}/documents`, {
    responses: {
      '200': {
        description: 'Voucher.Document DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Document)) where?: Where<Document>,
  ): Promise<Count> {

    const count = await this.voucherRepository.documents(id)['delete'](where);
    return count;

  }

}
