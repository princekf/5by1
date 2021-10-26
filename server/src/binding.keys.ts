import { BindingKey } from '@loopback/context';
import { UserService } from '@loopback/authentication';
import { Credentials } from './repositories';
import { PasswordHasher, ProfileUser } from './services';
import { FBOTokenServiceInft } from './services/fbo-token.serviceintf';

export class BindingKeys {


  public static TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );

  public static TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );

  public static TOKEN_SERVICE = BindingKey.create<FBOTokenServiceInft>(
    'services.authentication.jwt.tokenservice',
  );

  public static PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );

  public static ROUNDS = BindingKey.create<number>('services.hasher.round');

  public static USER_SERVICE = BindingKey.create<UserService<ProfileUser, Credentials>>(
    'services.user.service',
  );

  public static SESSION_DB_NAME = BindingKey.create<string>('session.database.name');

}
