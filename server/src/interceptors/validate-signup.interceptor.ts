import {
  inject,
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { RestBindings, Request } from '@loopback/rest';
import { BindingKeys } from '../binding.keys';
import { PasswordHasher } from '../services';
import { verifyAsync } from '../services/jwt.service';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: ValidateSignupInterceptor.BINDING_KEY}})
export class ValidateSignupInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateSignupInterceptor.name}`;

  constructor(@inject(RestBindings.Http.REQUEST) private request: Request,
  @inject(BindingKeys.TOKEN_SECRET)
  private jwtSecret: string,
  @inject(BindingKeys.PASSWORD_HASHER)
  public passwordHasher: PasswordHasher,) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {

    return this.intercept.bind(this);

  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ): Promise<unknown> {

    try {

      const { headers } = this.request;
      if (!headers.accesstoken) {

        throw new Error('Invalid captcha.');

      }
      const problem = await verifyAsync(headers.accesstoken as string, this.jwtSecret) as {answer: string};
      const [ { answer } ] = invocationCtx.args;
      const answerHash = await this.passwordHasher.comparePassword(answer, problem.answer);

      if (!answerHash) {

        throw new Error('Invalid captcha');

      }

      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      return result;

    } catch (err) {

      // Add error handling logic here
      throw err;

    }

  }

}
