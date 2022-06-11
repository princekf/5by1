import { Document } from '../models';
import {property} from '@loopback/repository';
export class DocumentResp extends Document {

    @property({
      type: 'string',
    })
    putURL?: string;

}
