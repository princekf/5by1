
const RANDOM_STR_DEFAULT_SIZE = 5;
const C_23 = 23;
const C_59 = 59;
const C_999 = 999;

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

    public updateTimeToMaximum = (inc: Date):Date => {

      const maxdDate = new Date(inc.getTime());
      maxdDate.setUTCHours(C_23, C_59, C_59, C_999);
      return maxdDate;

    }

    public updateTimeToMinimum = (inc: Date):Date => {

      const maxdDate = new Date(inc.getTime());
      maxdDate.setUTCHours(0, 0, 0, 0);
      return maxdDate;

    }

}

export const fboServerUtil = new FBOServerUtil();

export const DECIMAL_PART = 2;
