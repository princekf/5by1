import { UserDoc, UserModel } from './user.model';

class UserService {

    findUserByEmail = async(email:string):Promise<UserDoc> => {

      if (!email) {

        return null;

      }
      const UserM = UserModel.createModel();
      const user = await UserM.findOne({email: email.toLocaleLowerCase()});
      return user;

    }

}
export const userService = new UserService();
