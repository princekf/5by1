import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {
  AuthenticateFn,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  AuthenticationBindings,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import { LOGIN_API, INSTALL_API} from '@shared/server-apis';
import { BindingKeys } from './binding.keys';
const {SequenceActions} = RestBindings;
export class FBOSequence implements SequenceHandler {


  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  public invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) public invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
        @inject(AuthenticationBindings.AUTH_ACTION)
        protected authenticateRequest: AuthenticateFn,
  ) {
  }

  private findDBNamaeOfCommonRequests =
  (routePath: string, context: RequestContext, params: Array<{company: string}>) => {

    switch (routePath) {

    case INSTALL_API:
      if (process.env.COMMON_DB) {

        context.bind(BindingKeys.SESSION_DB_NAME).to(process.env.COMMON_DB);

      }
      break;
    case LOGIN_API:
      const [ uDetails ] = params;
      if (!uDetails.company) {

        const err = new Error('Parameter company is missing');
        Object.assign(err, {statusCode: 401 });
        this.reject(context, err);
        return;

      }
      context.bind(BindingKeys.SESSION_DB_NAME).to(<string>uDetails.company.toLowerCase());
      break;

    }

  };

  public handle = async(context: RequestContext):Promise<void> => {

    try {

      const {request, response} = context;
      const finished = await this.invokeMiddleware(context);
      if (finished) {

        return;

      }
      const route = this.findRoute(request);
      // Call authentication action
      const uProfile = await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      this.findDBNamaeOfCommonRequests(route.path, context, args);
      if (uProfile && uProfile.company) {

        context.bind(BindingKeys.SESSION_DB_NAME).to(<string>uProfile.company.toLowerCase());

      }
      const result = await this.invoke(route, args);
      this.send(response, result);

    } catch (err: any) {

      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {

        /* Unauthorized */
        Object.assign(err, {statusCode: 401 });

      }

      this.reject(context, err);

    }

  }

}
