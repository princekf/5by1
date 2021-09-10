import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import {TokenServiceBindings} from '../keys';

const signAsync = <(
  payload: unknown,
  secretOrPrivateKey: jwt.Secret,
  options?: jwt.SignOptions,
)=> string> <unknown> promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {

  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {
  }

  async verifyToken(token: string): Promise<UserProfile> {

    if (!token) {

      throw new HttpErrors.Unauthorized(
        'Error verifying token : \'token\' is null',
      );

    }

    let userProfile: UserProfile;

    try {

      // Decode user profile from token
      const decodedToken = <jwt.JwtPayload> await verifyAsync(token, this.jwtSecret);
      // Don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = {
        [securityId]: decodedToken.id,
        name: decodedToken.name,
        id: decodedToken.id,
        role: decodedToken.role,
      };

    } catch (error: any) {

      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );

    }
    return userProfile;

  }

  async generateToken(userProfile: UserProfile): Promise<string> {

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
