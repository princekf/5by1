import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import {BindingKeys} from '../binding.keys';
import { ProfileUser } from '.';

const signAsync = <(
  payload: unknown,
  secretOrPrivateKey: jwt.Secret,
  options?: jwt.SignOptions,
)=> string> <unknown> promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {

  constructor(
    @inject(BindingKeys.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(BindingKeys.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {
  }

  async verifyToken(token: string): Promise<ProfileUser> {

    if (!token) {

      throw new HttpErrors.Unauthorized(
        'Error verifying token : \'token\' is null',
      );

    }

    let userProfile: ProfileUser;

    try {

      // Decode user profile from token
      const decodedToken = <jwt.JwtPayload> await verifyAsync(token, this.jwtSecret);
      // Don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = {
        [securityId]: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        id: decodedToken.id,
        role: decodedToken.role,
        company: decodedToken.company,
      };

    } catch (error: any) {

      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );

    }
    return userProfile;

  }

  async generateToken(userProfile: ProfileUser): Promise<string> {

    if (!userProfile) {

      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );

    }
    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      role: userProfile.role,
      publicAddress: userProfile.publicAddress,
      email: userProfile.email,
      company: userProfile.company,
    };
    // Generate a JSON Web Token
    let token: string;
    try {

      token = <string> await signAsync(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });

    } catch (error) {

      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);

    }

    return token;

  }

}
