import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { inject, intercept } from '@loopback/context';
import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, HttpErrors, RequestContext } from '@loopback/rest';
import { ValidateUserForUniqueEMailInterceptor } from '../../interceptors';
import { BindingKeys } from '../../binding.keys';
import { basicAuthorization } from '../../middlewares/auth.midd';
import {NewUserRequest, User} from '../../models';
import { Credentials, UserRepository} from '../../repositories';
import { PasswordHasher } from '../../services';
import { AuthResponseSchema, CredentialsRequestBody, InstallRequestBody, InstallResponseSchema, UserProfileSchema } from '../specs/user-controller.specs';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { USER_API } from '@shared/server-apis';
import { resourcePermissions } from '../../utils/resource-permissions';

const authDetails = {
  allowedRoles: [ 'admin', 'user', 'super-admin' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
};
@authenticate('jwt')
@authorize(authDetails)
export class UserController {

  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @inject(BindingKeys.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(BindingKeys.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(BindingKeys.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject.context()
    public context: RequestContext,
  ) {}

  @authenticate.skip()
  @authorize.skip()
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
          schema: getModelSchemaRef(NewUserRequest, { title: 'NewUser',
            exclude: [ 'id', 'role' ] }),
        },
      },
    })
      newUserRequest: Credentials,
  ): Promise<User> {

    newUserRequest.role = 'user';


    try {

      // Create the new user
      const {password, ...userT} = newUserRequest;

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
      // Create super admin user

      // Encrypt the password
      const passwordC = await this.passwordHasher.hashPassword(
        process.env.SUPER_ADMIN_PASSWORD ?? 'YoYo231Hia',
      );
      const savedUser = await this.userRepository.create({
        name: process.env.SUPER_ADMIN_NAME,
        email: process.env.SUPER_ADMIN_EMAIL,
        role: 'super-admin',
      });

      // Set the password
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({password: passwordC});


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

  @get(`${USER_API}/me`, {
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
    ...authDetails})
  async printCurrentUser(
    @inject(SecurityBindings.USER)
      currentUserProfile: UserProfile,
  ): Promise<User> {

    const userId = currentUserProfile[securityId];
    const userT = await this.userRepository.findById(userId);
    return userT;

  }

  @post(USER_API)
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  @authorize({resource: resourcePermissions.userCreate.name,
    ...authDetails})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: [ 'id' ],
          }),
        },
      },
    })
      user: Omit<User, 'id'>,
  ): Promise<User> {

    user.role = 'user';
    const userRet = await this.userRepository.create(user);
    return userRet;

  }

  @get(`${USER_API}/count`)
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
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
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    await this.userRepository.deleteById(id);

  }


  @del(USER_API)
  @response(204, {
    description: 'Users DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
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
