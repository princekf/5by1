import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { UserRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: ValidateUserForUniqueEMailInterceptor.BINDING_KEY}})
export class ValidateUserForUniqueEMailInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateUserForUniqueEMailInterceptor.name}`;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

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
  ) {

    try {

      const [ { email } ] = invocationCtx.args;
      const nameAlreadyExist = await this.userRepository.find({where: {email}});
      if (nameAlreadyExist.length) {

        throw new HttpErrors.UnprocessableEntity(
          'E-Mail already exists',
        );

      }
      const result = await next();
      // Add post-invocation logic here
      return result;

    } catch (err) {

      // Add error handling logic here
      throw err;

    }

  }

}
