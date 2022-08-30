import {injectable, BindingScope, inject, Getter} from '@loopback/core';
import { Count, Filter, repository, Where } from '@loopback/repository';
import { HttpErrors, RequestContext } from '@loopback/rest';
import { BindingKeys } from '../binding.keys';
import { Company } from '../models';
import { CompanyModelForCreateSchema } from '../models/company.create.model';
import { CompanyRepository, UserRepository } from '../repositories';
import { PasswordHasher } from './hash-password.service';
import { permissions } from '@shared/util/permissions';


@injectable({scope: BindingScope.TRANSIENT})
export class CompanyService {

  constructor(@repository(CompanyRepository)
  public companyRepository : CompanyRepository,
    @inject.getter('repositories.UserRepository')
    private userRepositoryGetter: Getter<UserRepository>,
    @inject.context()
    public context: RequestContext,
    @inject(BindingKeys.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,) {}


  public create = async(companyS: Omit<CompanyModelForCreateSchema, 'id'>): Promise<Company> => {

    const {password, ...company} = companyS;
    const companyR = await this.companyRepository.create(company);
    this.context.bind(BindingKeys.SESSION_COMPANY_CODE).to(<string>company.code.toLowerCase());
    const passwordC = await this.passwordHasher.hashPassword(password);
    const userRepository = await this.userRepositoryGetter();
    const permissions2 = {
      'user': {
        key: 'user',
        name: 'User',
        operations: {
          list: true,
          view: true,
          create: true,
          update: true,
          delete: true,
        }
      },
      ...permissions
    };
    const savedUser = await userRepository.create({
      name: company.name,
      email: company.email,
      role: 'admin',
      permissions: permissions2
    });

    // Set the password
    await userRepository
      .userCredentials(savedUser.id)
      .create({password: passwordC});
    return companyR;

  };

  public count = async(where?: Where<Company>): Promise<Count> => {

    const countR = await this.companyRepository.count(where);
    return countR;

  };

  public find = async(filter?: Filter<Company>): Promise<Company[]> => {

    const resp = await this.companyRepository.find(filter);
    return resp;

  };

  public updateAll = async(company: Company, where?: Where<Company>): Promise<Count> => {

    const countR = await this.companyRepository.updateAll(company, where);
    return countR;

  };

  public findById = async(id: string, filter?: Filter<Company>): Promise<Company> => {

    const resp = await this.companyRepository.findById(id, filter);
    return resp;

  };

  public updateById = async(id: string, company: Company): Promise<void> => {

    await this.companyRepository.updateById(id, company);

  };

  public replaceById = async(id: string, company: Company): Promise<void> => {

    await this.companyRepository.replaceById(id, company);

  };

  public deleteById = async(id: string): Promise<void> => {

    await this.companyRepository.deleteById(id);

  };

  public deleteAll = async(where?: Where<Company>): Promise<Count> => {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : Company ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : Company ids are required');

    }

    const count = await this.companyRepository.deleteAll(where);
    return count;

  };

}
