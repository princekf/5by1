import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { AuthorizationMetadata, authorize, Authorizer } from '@loopback/authorization';
import { inject, intercept } from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { ValidateUserForUniqueEMailInterceptor } from '../../interceptors';
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../../keys';
import { basicAuthorization } from '../../middlewares/auth.midd';
import {NewUserRequest, User} from '../../models';
import {Credentials, UserRepository} from '../../repositories';
import { PasswordHasher } from '../../services';
import { CredentialsRequestBody, UserProfileSchema } from '../specs/user-controller.specs';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { USER_API } from '@shared/server-apis';
import { AuthResponse } from '@shared/util/auth-resp';

@authenticate('jwt')
@authorize({
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
})
export class UserController {

  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
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
          'application/json': {schema: getModelSchemaRef(AuthResponse)},
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {

    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};

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
  async printCurrentUser(
    @inject(SecurityBindings.USER)
      currentUserProfile: UserProfile,
  ): Promise<User> {

    const userId = currentUserProfile[securityId];
    const userT = await this.userRepository.findById(userId);
    return userT;

  }

  @post(`${USER_API}`)
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
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

  @get(`${USER_API}`)
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

  @patch(`${USER_API}`)
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

}
