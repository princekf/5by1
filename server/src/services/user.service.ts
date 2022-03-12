import {HttpErrors} from '@loopback/rest';
import {BranchRepository, Credentials, FinYearRepository, UserRepository} from '../repositories';
import {UserService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {BindingKeys} from '../binding.keys';
import {inject} from '@loopback/context';
import {PasswordHasher} from './hash-password.service';
import { User } from '../models';
import { ProfileUser as ProfileUserInft} from '@shared/util/profile-user';
export interface ProfileUser extends ProfileUserInft{
  [securityId]: string;
}
export class FBOUserService implements UserService<ProfileUser, Credentials> {

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(BranchRepository) public branchRepository: BranchRepository,
    @repository(FinYearRepository) public finYearRepository: FinYearRepository,
    @inject(BindingKeys.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {
  }

  private findBranchAndFinYear = async(foundUser: User):Promise<{ branch: string; finYear: string; }> => {

    let branch = '';
    let finYear = '';
    if (foundUser.branchIds?.length) {

      const branchF = await this.branchRepository.findById(foundUser.branchIds[0]);
      branch = branchF.code;

      const finYearF = await this.finYearRepository.findOne({
        where: {branchId: branchF.id},
      });
      finYear = finYearF?.code ?? '';

    } else if (foundUser.role === 'admin') {

      const branchF = await this.branchRepository.findOne();
      if (branchF) {

        branch = branchF.code;

        const finYearF = await this.finYearRepository.findOne({
          where: {branchId: branchF.id},
        });
        finYear = finYearF?.code ?? '';

      }

    }
    return {branch,
      finYear};

  };

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

    const brFs = await this.findBranchAndFinYear(foundUser);

    return {
      [securityId]: foundUser.id,
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      company: credentials.company,
      ...brFs
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
