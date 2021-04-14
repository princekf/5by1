import { sign } from 'jsonwebtoken';
import { UserProfile } from '@ls-util/auth/user.profile';

export interface ISessionValue {
  userProfile: UserProfile;
  exp: number;
}

const algorithm = 'HS512';
export class SessionManager {

  static createJWTToken = (userProfile:UserProfile):string => {

    const expiry = new Date();
    const EXPIRY_IN_MINUTES = 30;
    const SECOND_IN_MILLIE = 1000;
    expiry.setMinutes(expiry.getMinutes() + EXPIRY_IN_MINUTES);
    const exp:number = Math.round(expiry.getTime() / SECOND_IN_MILLIE);
    const userSession:ISessionValue = {
      userProfile,
      exp
    };
    const jwtToken = sign(
      userSession, process.env.AUTH_SHARED_SECRET, { algorithm }
    );
    return jwtToken;

  }

}
