import { TokenService } from '@loopback/authentication';
import {

  /* Inject, */
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  service,
  ValueOrPromise,
} from '@loopback/core';
import { Request, RestBindings } from '@loopback/rest';
import { BindingKeys } from '../binding.keys';
import { RequestLog } from '../models';
import { RequestLogService } from '../services';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('log', {tags: {name: 'LogRequest'}})
export class LogRequestInterceptor implements Provider<Interceptor> {

  constructor(@inject(RestBindings.Http.REQUEST) private request: Request,
  @service(RequestLogService) public requestLogService: RequestLogService,
  @inject(BindingKeys.TOKEN_SERVICE) public jwtService: TokenService,) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value(): ValueOrPromise<Interceptor> {

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

      const reqAt = new Date();
      // eslint-disable-next-line id-length
      const {headers, baseUrl, body, hostname, ip, method, originalUrl, params,
        path, protocol, query, subdomains } = this.request;

      const headersN = {...headers};

      delete headersN.authorization;
      delete headersN.accesstoken;

      const result = await next();
      const respAt = new Date();
      const log:Omit<RequestLog, 'id'> = {
        reqAt,
        respAt,
        baseUrl,
        method,
        path,
        body,
        hostname,
        ip,
        originalUrl,
        params,
        protocol,
        query,
        subdomains
      };
      if (headers.accesstoken) {

        const uPro = await this.jwtService.verifyToken(headers.accesstoken as string);
        log.email = uPro.email;
        log.branch = uPro.branch;
        log.finYear = uPro.finYear;

      }
      await this.requestLogService.create(log);
      return result;

    } catch (err) {

      // Add error handling logic here
      throw err;

    }

  }

}
