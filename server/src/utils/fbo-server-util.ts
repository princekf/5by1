
const RANDOM_STR_DEFAULT_SIZE = 5;

class FBOServerUtil {


    public generateRadomString = (size = RANDOM_STR_DEFAULT_SIZE): string => {

      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let idx = 0; idx < size; idx++) {

        result += characters.charAt(Math.floor(Math.random() * charactersLength));

      }
      return result;

    }

}

export const fboServerUtil = new FBOServerUtil();
