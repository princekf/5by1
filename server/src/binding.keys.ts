import { BindingKey } from '@loopback/context';
import { TokenService, UserService } from '@loopback/authentication';
import { User } from './models';
import { Credentials } from './repositories';
import { PasswordHasher } from './services';

export class BindingKeys {


  public static TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );

  public static TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );

  public static TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );

  public static PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );

  public static ROUNDS = BindingKey.create<number>('services.hasher.round');

  public static USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );

}
