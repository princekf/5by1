import { injectable, Interceptor, InvocationContext, InvocationResult, Provider, ValueOrPromise } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { FinYearRepository, VoucherRepository } from '../repositories';
import {SecurityBindings} from '@loopback/security';
import { inject } from '@loopback/context';
import { ProfileUser } from '../services';
import { Branch, FinYear } from '../models';

const L_HOUR = 23;
const L_MINUTE = 59;
const L_SECOND = 59;
const L_MICRO = 999;

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// eslint-disable-next-line no-use-before-define
@injectable({tags: {key: ValidateVoucherInterceptor.BINDING_KEY}})
export class ValidateVoucherInterceptor implements Provider<Interceptor> {

  static readonly BINDING_KEY = `interceptors.${ValidateVoucherInterceptor.name}`;

  constructor(
    @repository(VoucherRepository)
    public voucherRepository: VoucherRepository,
    @inject(SecurityBindings.USER)
    private uProfile: ProfileUser,
    @repository(FinYearRepository)
    public finYearRepository : FinYearRepository,
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

  private validateFinYearRange = (sFinYear: FinYear, sDate: string) => {

    const cDate = new Date(sDate);
    const cTime = cDate.getTime();
    const fyS = sFinYear.startDate;
    const fyE = sFinYear.endDate;
    const startTime = new Date(fyS.getFullYear(), fyS.getMonth(), fyS.getDate(), 0, 0, 0, 0).getTime();
    const endTime = new Date(fyE.getFullYear(), fyE.getMonth(), fyE.getDate(), L_HOUR, L_MINUTE, L_SECOND, L_MICRO)
      .getTime();
    if (cTime < startTime || cTime > endTime) {

      throw new HttpErrors.UnprocessableEntity(
        `Voucher date is outside financial year : ${fyS} - ${fyE}`,
      );

    }

  }

  private validateInputs = async(id: string, number: string) => {

    if ((/^\s|\s$/u).test(number)) {

      throw new HttpErrors.UnprocessableEntity(
        'Voucher number should not contains white spaces at end or beginning.',
      );

    }
    if (id && !number) {

      throw new HttpErrors.UnprocessableEntity(
        'Voucher number is required.',
      );

    }
    if (number) {

      const dupVouchers = await this.voucherRepository.find({where: {
        id: {nin: [ id ]},
        number: {regexp: `/^${number}/i`}
      }});

      if (dupVouchers?.length > 0) {

        throw new HttpErrors.UnprocessableEntity(
          `Duplicate voucher number - ${number}.`,
        );

      }

    }

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

      const [ { id, number, date } ] = invocationCtx.args.slice(-1);
      await this.validateInputs(id, number);
      const { finYear, branch } = this.uProfile;
      const pQuery = await this.finYearRepository.execute(this.finYearRepository.modelClass.name, 'aggregate', [
        {$match: { code: { $eq: finYear}}},
        {$lookup: {
          from: Branch.name,
          localField: 'branchId',
          foreignField: '_id',
          as: 'branch'
        }},
        {$unwind: '$branch'},
        {$match: { 'branch.code': branch}},
      ]);
      const finYears = <Array<FinYear>> await pQuery.toArray();
      if (!finYears.length) {

        throw new HttpErrors.UnprocessableEntity(
          'Invalid financial year',
        );

      }

      const [ sFinYear ] = finYears;
      this.validateFinYearRange(sFinYear, date);
      const result = await next();
      // Add post-invocation logic here
      return result;

    } catch (err) {

      // Add error handling logic here
      throw err;

    }

  }

}
