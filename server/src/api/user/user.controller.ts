import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SIGNUP_API, LOGIN_API } from '@shared/serverAPI';
import { UserDoc, UserModel } from './user.model';
import { User, UserS } from '@shared/entity/User';
import { CommonUtil } from '@ls-base/util/common.util';
import { HTTP_RESPONSE_CODE, ACCESS_TOKEN_ID } from '@shared/Constants';
import { userService } from './user.service';
import { SessionManager } from '@ls-base/util/auth/session.manage';

const { HTTP_OK, HTTP_BAD_REQUEST } = HTTP_RESPONSE_CODE;

class UserController {

  private register = async(request:FastifyRequest, reply:FastifyReply) => {

    const UserM = UserModel.createModel();
    const userR:UserS = <UserS>request.body;
    if (!userR.name || !userR.email || !CommonUtil.validateEmail(userR.email)) {

      reply.status(HTTP_BAD_REQUEST).send({message: 'Invalid name or email'});
      return;

    }
    const {password} = <{password: string}>request.body;
    if (!password) {

      reply.status(HTTP_BAD_REQUEST).send({message: 'Password is required'});
      return;

    }
    const userE:UserS = await userService.findUserByEmail(userR.email);
    if (userE) {

      reply.status(HTTP_BAD_REQUEST).send({message: 'Email id already exists.'});
      return;

    }
    const user: UserDoc = new UserM(userR);
    if (password) {

      const hashings = CommonUtil.createHashAndSalt(password);
      user.hash = hashings.hash;
      user.salt = hashings.salt;

    }
    await user.save();
    reply.send(user).status(HTTP_OK);

  };

  private login = async(request:FastifyRequest, reply:FastifyReply) => {

    const userR:User = <User>request.body;
    const userE = await userService.findUserByEmail(userR.email);

    if (!userE || !CommonUtil.isValidPassword({password: userR.password,
      hash: userE.hash,
      salt: userE.salt})) {

      reply.status(HTTP_BAD_REQUEST).send({message: 'Email or password is wrong. Try again.'});
      return;

    }
    const accessToken = SessionManager.createJWTToken({name: userE.name,
      email: userE.email});
    reply.header(ACCESS_TOKEN_ID, accessToken);
    reply.send({message: 'success'}).status(HTTP_OK);

  };

  router = (fastify:FastifyInstance, opts:unknown, done:() => void) => {

    fastify.post(SIGNUP_API, this.register);
    fastify.post(LOGIN_API, this.login);
    done();

  };

}

const userController = new UserController();
export default userController;
