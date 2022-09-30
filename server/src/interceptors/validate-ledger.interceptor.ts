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
@injectable({tags: {key: ValidateLedgerInterceptor.BINDING_KEY}})
export class ValidateLedgerInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateLedgerInterceptor.name}`;

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


  private fetchParams = (args: any):{id?: string, code: string, name: string} => {

    const [ first, second ] = args;

    if (second) {

      const {code, name} = second;
      return {id: first,
        name,
        code};

    }
    return first;


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


      const {code, name} = this.fetchParams(invocationCtx.args);
      if ((/^\s|\s$/u).test(code)) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger code should not contains white spaces at end or beginning.',
        );

      }
      if ((/^\s|\s$/u).test(name)) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger name should not contains white spaces at end or beginning.',
        );

      }
      const nameAlreadyExist = await this.ledgerRepository.find({where: {or: [ {name: {regexp: `/^${name}$/i`}}, {code: {regexp: `/^${code}$/i`}} ]}});
      if (nameAlreadyExist.length) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger code/name already exists',
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
