import {HttpErrors} from '@loopback/rest';
import {Credentials, UserRepository} from '../repositories';
import {UserService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {BindingKeys} from '../binding.keys';
import {inject} from '@loopback/context';
import {PasswordHasher} from './hash-password.service';

export interface ProfileUser {
  [securityId]: string;
  [attribute: string]: any;
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
}
export class FBOUserService implements UserService<ProfileUser, Credentials> {

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(BindingKeys.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {
  }

  async verifyCredentials(credentials: Credentials): Promise<ProfileUser> {

    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {

      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {

      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password, credentialsFound.password,
    );

    if (!passwordMatched) {

      throw new HttpErrors.Unauthorized(invalidCredentialsError);

    }

    return {
      [securityId]: foundUser.id,
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      company: credentials.company,
    };

  }

  // eslint-disable-next-line class-methods-use-this
  public convertToUserProfile(user: ProfileUser): UserProfile {

    const {id, ...userT} = user;
    return {
      id,
      ...userT
    };

  }

}
