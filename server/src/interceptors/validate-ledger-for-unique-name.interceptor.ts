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
import { LedgerRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: ValidateLedgerForUniqueCodeInterceptor.BINDING_KEY}})
export class ValidateLedgerForUniqueCodeInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateLedgerForUniqueCodeInterceptor.name}`;

  constructor(
    @repository(LedgerRepository)
    public ledgerRepository: LedgerRepository
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


      const [ { name } ] = invocationCtx.args;
      if ((/^\s|\s$/u).test(name)) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger name should not contains white spaces at end or beginning.',
        );

      }
      const nameAlreadyExist = await this.ledgerRepository.find({where: {name: {regexp: `/^${name}$/i`}}});
      if (nameAlreadyExist.length) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger name already exists',
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
