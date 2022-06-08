import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {Document} from '../models';
import {DocumentRepository} from '../repositories';
import { Document as DocumentIntf } from '@shared/entity/common/document';
import { DocumentResp } from '../utils/document.resp';
import {DOCUMENT_API} from '@shared/server-apis';
import { fboServerUtil } from '../utils/fbo-server-util';
import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { adminAndUserAuthDetails } from '../utils/authorize-details';
import { inject } from '@loopback/core';
import {SecurityBindings} from '@loopback/security';
import { ProfileUser } from '../services';
import { awsPreSignedUrlUtil } from '../utils/aws-pre-signed-url.util';

@authenticate('jwt')
@authorize(adminAndUserAuthDetails)
export class DocumentController {

  constructor(
    @repository(DocumentRepository)
    public documentRepository : DocumentRepository,
  ) {}

  @post(DOCUMENT_API)
  @response(200, {
    description: 'Document model instance',
    content: {'application/json': {schema: getModelSchemaRef(DocumentResp)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {
            title: 'NewDocument',
            exclude: [ 'id', 'key' ],
          }),
        },
      },
    })
      document: Omit<Document, 'id'>,
      @inject(SecurityBindings.USER) uProfile: ProfileUser,
  ): Promise<DocumentIntf> {

    const {company, branch, finYear} = uProfile;
    const key = `${company}/${branch}/${finYear}/${fboServerUtil.generateRadomString()}-${document.name}`;
    document.key = key;
    const doc: DocumentResp = await this.documentRepository.create(document);
    const putURL = await awsPreSignedUrlUtil.createTemporarySignedPUTUrl(key);
    return {...doc,
      putURL};

  }

  @get(`${DOCUMENT_API}/count`)
  @response(200, {
    description: 'Document model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Document) where?: Where<Document>,
  ): Promise<Count> {

    const count = await this.documentRepository.count(where);
    return count;

  }

  @get(DOCUMENT_API)
  @response(200, {
    description: 'Array of Document model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Document, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Document) filter?: Filter<Document>,
  ): Promise<Document[]> {

    const documents = await this.documentRepository.find(filter);
    return documents;

  }

  @patch(DOCUMENT_API)
  @response(200, {
    description: 'Document PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
      document: Document,
    @param.where(Document) where?: Where<Document>,
  ): Promise<Count> {

    const count = await this.documentRepository.updateAll(document, where);
    return count;

  }

  @get(`${DOCUMENT_API}/{id}`)
  @response(200, {
    description: 'Document model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Document, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Document, {exclude: 'where'}) filter?: FilterExcludingWhere<Document>
  ): Promise<Document> {

    const doc = await this.documentRepository.findById(id, filter);
    return doc;

  }

  @patch(`${DOCUMENT_API}/{id}`)
  @response(204, {
    description: 'Document PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
      document: Document,
  ): Promise<void> {

    await this.documentRepository.updateById(id, document);

  }

  @put(`${DOCUMENT_API}/{id}`)
  @response(204, {
    description: 'Document PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() document: Document,
  ): Promise<void> {

    await this.documentRepository.replaceById(id, document);

  }

  @del(`${DOCUMENT_API}/{id}`)
  @response(204, {
    description: 'Document DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.documentRepository.deleteById(id);

  }

}
