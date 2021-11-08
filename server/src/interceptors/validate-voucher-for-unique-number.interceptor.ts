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
import { VoucherRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: ValidateVoucherForUniqueNumInterceptor.BINDING_KEY}})
export class ValidateVoucherForUniqueNumInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateVoucherForUniqueNumInterceptor.name}`;

  constructor(
    @repository(VoucherRepository)
    public voucherRepository: VoucherRepository
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


      const [ { number } ] = invocationCtx.args;
      if ((/^\s|\s$/u).test(number)) {

        throw new HttpErrors.UnprocessableEntity(
          'Voucher number should not contains white spaces at end or beginning.',
        );

      }
      const nameAlreadyExist = await this.voucherRepository.find({where: {number: {regexp: `/^${number}$/i`}}});
      if (nameAlreadyExist.length) {

        throw new HttpErrors.UnprocessableEntity(
          'Voucher already exists',
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
