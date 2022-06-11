import {Entity, model, property} from '@loopback/repository';
import { Document as DocumentIntf } from '@shared/entity/common/document';

@model({settings: {strict: true}})
export class Document extends Entity implements DocumentIntf {

  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  key?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  constructor(data?: Partial<Document>) {

    super(data);

  }

}

export interface DocumentRelations {
  // Describe navigational properties here
}

export type DocumentWithRelations = Document & DocumentRelations;
