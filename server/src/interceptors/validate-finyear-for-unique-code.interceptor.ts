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
import { FinYearRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: ValidateFinYearForUniqueCodeInterceptor.BINDING_KEY}})
export class ValidateFinYearForUniqueCodeInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateFinYearForUniqueCodeInterceptor.name}`;

  constructor(
    @repository(FinYearRepository)
    public finYearRepository: FinYearRepository
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value():any {

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
  ):Promise<unknown> {

    try {

      const [ { code } ] = invocationCtx.args;
      if ((/\s/gu).test(code)) {

        throw new HttpErrors.UnprocessableEntity(
          'Financial year code should not contains white spaces.',
        );

      }
      const nameAlreadyExist = await this.finYearRepository.find({where: {code: {regexp: `/^${code}$/i`}}});
      if (nameAlreadyExist.length) {

        throw new HttpErrors.UnprocessableEntity(
          'Financial year code already exists',
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
