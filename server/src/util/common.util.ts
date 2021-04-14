import { pbkdf2Sync, randomBytes } from 'crypto';


const BYTE_SIZE = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 512;

export class CommonUtil {

    public static validateEmail = (email: string): boolean => {

      const emailRegEx = /^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm;
      return emailRegEx.test(email);

    };

    public static createHashAndSalt = (password: string): {salt:string, hash:string} => {

      const salt = randomBytes(BYTE_SIZE).toString('hex');
      const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex');
      return {salt,
        hash};

    };

    public static isValidPassword = (params:{salt:string, hash:string, password:string}): boolean => {

      const hash = pbkdf2Sync(params.password, params.salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex');
      return params.hash === hash;

    };

    public static calcuateGetURLExpiry = ():Date => {

      const expiry = new Date();
      const ONE_MINUTE = 60;
      expiry.setMinutes(expiry.getMinutes() + Number(process.env.TEMP_GET_URL_EXPIRY) / ONE_MINUTE);
      return expiry;

    }


}
