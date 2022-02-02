import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject, intercept } from '@loopback/context';
import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, RequestContext } from '@loopback/rest';
import { ValidateUserForUniqueEMailInterceptor } from '../interceptors';
import { BindingKeys } from '../binding.keys';
import {NewUserRequest, User} from '../models';
import { BranchRepository, CompanyRepository, Credentials, FinYearRepository, UserRepository} from '../repositories';
import { PasswordHasher, ProfileUser } from '../services';
import { AuthResponseSchema, CredentialsRequestBody, InstallRequestBody,
  InstallResponseSchema, SwitchFinYearRequestBody, SwitchFinYearResponseSchema, ChangePasswordRequestBody,
  UserProfileSchema, ChangePasswordResponseSchema } from './specs/user-controller.specs';
import {SecurityBindings, securityId} from '@loopback/security';
import { ME_API, MY_ACCOUNT_API, USER_API, SWITCH_FIN_YEAR_API } from '@shared/server-apis';
import { resourcePermissions } from '../utils/resource-permissions';
import { adminAndUserAuthDetails, allRoleAuthDetails, superAdminAuthDetails } from '../utils/autherize-details';
import { MyAccountResp } from '@shared/util/my-account-resp';
import { SessionUser } from '@shared/util/session-user';

@authenticate('jwt')
@authorize(allRoleAuthDetails)
export class UserController {

  // eslint-disable-next-line max-params
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @repository(CompanyRepository)
    public companyRepository : CompanyRepository,
    @repository(BranchRepository)
    public branchRepository : BranchRepository,
    @repository(FinYearRepository)
    public finYearRepository : FinYearRepository,
    @inject(BindingKeys.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(BindingKeys.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(BindingKeys.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject.context()
    public context: RequestContext,
  ) {}

  private updateUserCredentials = async(userId: string, password: string):Promise<void> => {

    // Encrypt the password
    const passwordC = await this.passwordHasher.hashPassword(
      password,
    );
    const savedUser = await this.userRepository.findById(userId);

    // Set the password
    await this.userRepository
      .userCredentials(savedUser.id)
      .create({password: passwordC});

  }

  private saveUserWithCredentials = async(userT: Partial<User>, password: string):Promise<User> => {

    try {

      // Encrypt the password
      const passwordC = await this.passwordHasher.hashPassword(
        password,
      );
      const savedUser = await this.userRepository.create(userT);

      // Set the password
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({password: passwordC});

      return savedUser;

    } catch (errorP: unknown) {

      const error = errorP as {code: number, errmsg: string};
      // MongoError 11000 duplicate key
      const mongoDuplicateKey = 11000;
      if (error.code === mongoDuplicateKey && error.errmsg.includes('index: uniqueEmail')) {

        throw new HttpErrors.Conflict('Email value is already taken');

      } else {

        throw error;

      }

    }

  }

  @intercept(ValidateUserForUniqueEMailInterceptor.BINDING_KEY)
  @post(USER_API)
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  @authorize({resource: resourcePermissions.userCreate.name,
    ...allRoleAuthDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      userR: Omit<NewUserRequest, 'id'>,
  ): Promise<User> {

    const {password, ...user} = userR;
    user.role = 'user';
    const userRet = await this.saveUserWithCredentials(user, password);
    return userRet;

  }

  @intercept(ValidateUserForUniqueEMailInterceptor.BINDING_KEY)
  @post(`${USER_API}/signup`, {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { title: 'Sign-Up User',
            exclude: [ 'id', 'role' ] }),
        },
      },
    })
      newUserRequest: Credentials,
  ): Promise<User> {

    newUserRequest.role = 'user';
    // Create the new user
    const {password, ...userT} = newUserRequest;
    const userR = await this.saveUserWithCredentials(userT, password);
    return userR;

  }

  @authenticate.skip()
  @authorize.skip()
  @post(`${USER_API}/login`, {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {schema: AuthResponseSchema},
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {

    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user,);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};

  }

  private installDefaultData = async() => {

    // Create default company.
    await this.companyRepository.create({
      name: 'Five By One Solutions',
      code: process.env.COMMON_COMPANY_CODE,
      email: process.env.SUPER_ADMIN_EMAIL,
    });

    // Encrypt the password
    const passwordC = await this.passwordHasher.hashPassword(
      process.env.SUPER_ADMIN_PASSWORD ?? 'YoYo231Hia',
    );
    // Create super admin user
    const permissions = {
      'company': {
        key: 'company',
        name: 'Company',
        operations: {view: true,
          create: true,
          update: true,
          delete: true, }
      }
    };
    const savedUser = await this.userRepository.create({
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      role: 'super-admin',
      permissions,
    });

    // Set the password
    await this.userRepository
      .userCredentials(savedUser.id)
      .create({password: passwordC});

  };

  @authenticate.skip()
  @authorize.skip()
  @post(`${USER_API}/install`, {
    responses: {
      '200': {
        description: 'Install status',
        content: {
          'application/json': {schema: InstallResponseSchema},
        },
      },
    },
  })
  async install(
    @requestBody(InstallRequestBody) credentials: {installSecret: string},
  ): Promise<{message: string}> {

    try {

      if (credentials.installSecret !== process.env.INSTALL_APP_SECRET) {

        throw new HttpErrors.Forbidden('Invalid credentials.');

      }
      await this.installDefaultData();

    } catch (errorP: unknown) {

      const error = errorP as {code: number, errmsg: string};
      // MongoError 11000 duplicate key
      const mongoDuplicateKey = 11000;
      if (error.code === mongoDuplicateKey && error.errmsg.includes('index: uniqueEmail')) {

        throw new HttpErrors.Conflict('Email value is already taken');

      } else {

        throw error;

      }

    }
    const message = 'I am ready';
    return {message};

  }

  @authorize({resource: resourcePermissions.userUpdate.name,
    ...superAdminAuthDetails})
  @post(`${USER_API}/{id}/change-password`, {
    responses: {
      '200': {
        description: 'Change password',
        content: {
          'application/json': {schema: ChangePasswordResponseSchema},
        },
      },
    },
  })
  async changePassword(
    @param.path.string('id') id: string,
    @requestBody(ChangePasswordRequestBody) credentials: {password: string},
  ): Promise<{message: string}> {

    if (!credentials.password) {

      throw new HttpErrors.Forbidden('Invalid credentials.');

    }
    await this.updateUserCredentials(id, credentials.password);
    const message = 'Password updated';
    return {message};

  }

  @get(ME_API, {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.commonResources.name,
    ...allRoleAuthDetails})
  async printCurrentUser(
    @inject(SecurityBindings.USER)
      cUProfile: ProfileUser,
  ): Promise<SessionUser> {

    const userId = cUProfile[securityId];
    const user = await this.userRepository.findById(userId);
    const company = await this.companyRepository.findOne({where: {code: {regexp: `/^${cUProfile.company}$/i`}}});
    const branch = await this.branchRepository.findOne({where: {code: {regexp: `/^${cUProfile.branch}$/i`}}});
    const finYear = await this.finYearRepository.findOne({where: {code: {regexp: `/^${cUProfile.finYear}$/i`}}});

    return {user,
      company,
      branch,
      finYear};

  }

  @get(MY_ACCOUNT_API, {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.commonResources.name,
    ...allRoleAuthDetails})
  async findSessionAccountDetails(
    @inject(SecurityBindings.USER)
      currentUserProfile: ProfileUser,
    @repository(CompanyRepository)
      companyRepository : CompanyRepository,
    @repository(BranchRepository)
      branchRepository : BranchRepository,
    @repository(FinYearRepository)
      finYearRepository : FinYearRepository,
  ): Promise<MyAccountResp> {

    const userId = currentUserProfile[securityId];
    const user = await this.userRepository.findById(userId);
    const company = await companyRepository.findOne({
      where: {code: {regexp: `/^${currentUserProfile.company}$/i`}},
    });
    const branches = await branchRepository.find();
    const finYears = await finYearRepository.find();
    return {user,
      company,
      branches,
      finYears,
      sessionUser: currentUserProfile};

  }

  @post(SWITCH_FIN_YEAR_API, {
    responses: {
      '200': {
        description: 'Switch financial year status',
        content: {
          'application/json': {schema: SwitchFinYearResponseSchema},
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.commonResources.name,
    ...adminAndUserAuthDetails})
  async switchFinYear(
    @requestBody(SwitchFinYearRequestBody) data: {finYearId: string},
    @inject(SecurityBindings.USER)
      currentUserProfile: ProfileUser,
    @repository(BranchRepository)
      branchRepository : BranchRepository,
    @repository(FinYearRepository)
      finYearRepository : FinYearRepository,
  ): Promise<{token: string}> {

    const finYear = await finYearRepository.findById(data.finYearId);
    const branch = await branchRepository.findById(finYear.branchId);
    const userProfile2 = {...currentUserProfile};
    userProfile2.branch = branch.code;
    userProfile2.finYear = finYear.code;
    const token = await this.jwtService.generateToken(userProfile2);
    return {token};

  }


  @get(`${USER_API}/count`)
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.userView.name,
    ...allRoleAuthDetails})
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {

    const count = await this.userRepository.count(where);
    return count;

  }

  @get(USER_API)
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({resource: resourcePermissions.userView.name,
    ...allRoleAuthDetails})
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {

    const users = await this.userRepository.find(filter);
    return users;

  }

  @patch(USER_API)
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.userUpdate.name,
    ...allRoleAuthDetails})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
      user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {

    const count = await this.userRepository.updateAll(user, where);
    return count;

  }

  @get(`${USER_API}/{id}`)
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  @authorize({resource: resourcePermissions.userView.name,
    ...allRoleAuthDetails})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {

    const userRet = await this.userRepository.findById(id, filter);
    return userRet;

  }

  @patch(`${USER_API}/{id}`)
  @response(204, {
    description: 'User PATCH success',
  })
  @authorize({resource: resourcePermissions.userUpdate.name,
    ...allRoleAuthDetails})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
      user: User,
  ): Promise<void> {

    await this.userRepository.updateById(id, user);

  }

  @put(`${USER_API}/{id}`)
  @response(204, {
    description: 'User PUT success',
  })
  @authorize({resource: resourcePermissions.userUpdate.name,
    ...allRoleAuthDetails})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {

    await this.userRepository.replaceById(id, user);

  }

  @del(`${USER_API}/{id}`)
  @response(204, {
    description: 'User DELETE success',
  })
  @authorize({resource: resourcePermissions.userDelete.name,
    ...allRoleAuthDetails})
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.userRepository.deleteById(id);

  }


  @del(USER_API)
  @response(204, {
    description: 'Users DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({resource: resourcePermissions.userDelete.name,
    ...allRoleAuthDetails})
  async deleteAll(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {

    if (!where) {

      throw new HttpErrors.Conflict('Invalid parameter : User ids are required');

    }
    const whereC = where as {id: {inq: Array<string>}};
    if (!whereC.id || !whereC.id.inq || whereC.id.inq.length < 1) {

      throw new HttpErrors.Conflict('Invalid parameter : User ids are required');

    }

    const count = await this.userRepository.deleteAll(where);
    return count;

  }

}
