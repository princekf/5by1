import {Getter, inject} from '@loopback/context';
import {HttpErrors, Request, RequestContext} from '@loopback/rest';
import {AuthenticationStrategy} from '@loopback/authentication';

import {BindingKeys} from '../binding.keys';
import { ProfileUser } from '../services';
import { FBOTokenServiceInft } from '../services/fbo-token.serviceintf';
import { UserRepository } from '../repositories';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {

  name = 'jwt';

  private message401 = 'Authorization header not found.';

  constructor(
    @inject(BindingKeys.TOKEN_SERVICE)
    public tokenService: FBOTokenServiceInft,
  ) {}

  async authenticate(request: Request): Promise<ProfileUser | undefined> {

    const token: string = this.extractCredentials(request);
    const userProfile: ProfileUser = await this.tokenService.verifyToken(token);
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
