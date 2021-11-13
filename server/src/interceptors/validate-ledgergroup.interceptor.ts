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
import { defalutLedgerGroupCodes } from '@shared/util/ledger-group-codes';
import { LedgerGroupRepository } from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: ValidateLedgerGroupInterceptor.BINDING_KEY}})
export class ValidateLedgerGroupInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateLedgerGroupInterceptor.name}`;

  constructor(
    @repository(LedgerGroupRepository)
    public ledgerGroupRepository: LedgerGroupRepository
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

  private checkIfDefaultLedgerGroupCodeChange = async(code: string, id?: string) => {

    if (!id) {

      return;

    }
    const lGroupCur = await this.ledgerGroupRepository.findById(id);

    for (const key in defalutLedgerGroupCodes) {

      if (defalutLedgerGroupCodes[key] === lGroupCur.code) {

        if (lGroupCur.code !== code) {

          throw new HttpErrors.UnprocessableEntity(
            `Can't delete the code of default ledger group -- existing code ${lGroupCur.code} and new code ${code}`,
          );

        }

      }

    }

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


      const {id, code, name} = this.fetchParams(invocationCtx.args);

      if ((/^\s|\s$/u).test(code)) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger group code should not contains white spaces at end or beginning.',
        );

      }
      if ((/^\s|\s$/u).test(name)) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger group name should not contains white spaces at end or beginning.',
        );

      }
      // Should not allow to edit code of default ledger groups.
      await this.checkIfDefaultLedgerGroupCodeChange(code, id);
      const nameAlreadyExist = await this.ledgerGroupRepository.find({where: {or: [ {name: {regexp: `/^${name}$/i`}}, {code: {regexp: `/^${code}$/i`}} ]}});
      if (nameAlreadyExist.length) {

        throw new HttpErrors.UnprocessableEntity(
          'Ledger group code/name already exists',
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
