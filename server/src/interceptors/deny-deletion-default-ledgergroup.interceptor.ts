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
import { defaultLedgerGroups } from '../install/default.ledgergroups';
import { LedgerGroupRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: DenyDeletionOfDefaultLedgerGroup.BINDING_KEY}})
export class DenyDeletionOfDefaultLedgerGroup implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${DenyDeletionOfDefaultLedgerGroup.name}`;

  constructor(
    @repository(LedgerGroupRepository)
    public ledgerGroupRepository: LedgerGroupRepository) { }

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

      const [ where ] = invocationCtx.args;
      const lgs = await this.ledgerGroupRepository.find({where});
      for (const lGroup of lgs) {

        for (const dGroup of defaultLedgerGroups) {

          if (lGroup.code === dGroup.code) {

            throw new HttpErrors.UnprocessableEntity(
              `You are not allowed to delete default ledger group -- ${lGroup.name}`,
            );

          }

        }

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
