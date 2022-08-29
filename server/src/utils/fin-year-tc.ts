import { property } from '@loopback/repository';
import { FinYear } from '../models';

export class FinYearTC extends FinYear {

    @property({
      type: 'string',
      required: false,
    })
    refFinYearId? : string;

}
