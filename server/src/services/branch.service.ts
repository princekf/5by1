import {injectable, BindingScope} from '@loopback/core';
import { FilterExcludingWhere, repository } from '@loopback/repository';
import { Branch } from '../models';
import { BranchRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class BranchService {

  constructor(@repository(BranchRepository) private branchRepository : BranchRepository) {}


  findById = async(id: string, filter?: FilterExcludingWhere<Branch>): Promise<Branch> => {

    const finYearR = await this.branchRepository.findById(id, filter);
    return finYearR;

  }

}
