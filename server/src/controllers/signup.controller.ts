import { intercept, service } from '@loopback/core';
import {post, get, getModelSchemaRef, requestBody, response, } from '@loopback/rest';
import { SIGNUP_API } from '@shared/server-apis';
import { ValidateSignupInterceptor } from '../interceptors/validate-signup.interceptor';
import { SignupLog } from '../models/signup-log.model';
import { SignupLogService } from '../services/signup-log.service';
import { AuthResponseSchema, SignupRequestBody } from './specs/user-controller.specs';

export class SignupController {

  constructor(@service(SignupLogService) public signupLogService: SignupLogService,) {}

  @intercept(ValidateSignupInterceptor.BINDING_KEY)
  @post(SIGNUP_API)
  @response(200, {
    description: 'Sign-up API',
    content: {'application/json': {schema: getModelSchemaRef(SignupLog)}},
  })
  async create(
    @requestBody(SignupRequestBody)
      signupLog: Omit<SignupLog, 'id'>,
  ): Promise<SignupLog> {

    const resp = await this.signupLogService.create(signupLog);
    return resp;

  }

  @get(`${SIGNUP_API}/captcha`, {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: AuthResponseSchema,
          },
        },
      },
    },
  })
  async captcha(): Promise<{ token: string; }> {


    const token = await this.signupLogService.createCaptcha();
    return token;

  }

}
