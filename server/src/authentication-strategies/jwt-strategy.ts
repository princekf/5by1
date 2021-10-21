import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

import {BindingKeys} from '../binding.keys';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {

  name = 'jwt';

  private message401 = 'Authorization header not found.';

  constructor(
    @inject(BindingKeys.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {

    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.tokenService.verifyToken(token);
    return userProfile;

  }

  extractCredentials(request: Request): string {

    if (!request.headers.authorization) {

      throw new HttpErrors.Unauthorized(this.message401);

    }

    // For example: Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {

      throw new HttpErrors.Unauthorized(
        'Authorization header is not of type \'Bearer\'.',
      );

    }

    // Split the string into 2 parts: 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    const partsLength = 2;
    if (parts.length !== partsLength) {

      throw new HttpErrors.Unauthorized(
        'Authorization header value has too many parts. It must follow the pattern: \'Bearer xx.yy.zz\' where xx.yy.zz is a valid JWT token.',
      );

    }
    const [ , token ] = parts;
    return token;

  }

}
