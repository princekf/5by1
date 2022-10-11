import { intercept, service } from '@loopback/core';
import { FilterExcludingWhere } from '@loopback/repository';
import {post, get, getModelSchemaRef, requestBody, response, param, } from '@loopback/rest';
import { SIGNUP_API } from '@shared/server-apis';
import { ValidateSignupInterceptor } from '../interceptors/validate-signup.interceptor';
import { SignupLog } from '../models/signup-log.model';
import { SignupLogService } from '../services/signup-log.service';
import { SignupInitiateResponse, SignupInitiateResponseSchema } from './specs/common-specs';
import { AuthResponseSchema, SignupRequestBody } from './specs/user-controller.specs';

export class SignupController {

  constructor(@service(SignupLogService) public signupLogService: SignupLogService,) {}

  @intercept(ValidateSignupInterceptor.BINDING_KEY)
  @post(`${SIGNUP_API}/initiate-signup`)
  @response(200, {
    description: 'Initiate sign-up API',
    content: {'application/json': {schema: SignupInitiateResponseSchema}},
  })
  async initiateSignup(
    @requestBody(SignupRequestBody)
      signupLog: Omit<SignupLog, 'id'>,
  ): Promise<SignupInitiateResponse> {

    const resp = await this.signupLogService.initiateSignup(signupLog);
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

  @get(`${SIGNUP_API}/validate-signup/{token}`)
  @response(200, {
    description: 'Signup log',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SignupLog, {includeRelations: true}),
      },
    },
  })
  async validateSignup(
    @param.path.string('token') token: string,
  ): Promise<{email: string}> {

    const lgR = await this.signupLogService.validateSignup(token);
    return lgR;

  }

}
