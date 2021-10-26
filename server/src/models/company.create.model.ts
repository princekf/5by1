import { Company } from './company.model';
import {model, property} from '@loopback/repository';

@model()
export class CompanyModelForCreateSchema extends Company {


    @property({
      type: 'string',
      required: true,
    })
    password: string;

}
