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
  Request,
} from '@loopback/rest';
import {
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  AuthenticationBindings,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import { LOGIN_API, INSTALL_API, USER_API, BRANCH_API, FIN_YEAR_API, COMPANY_API } from '@shared/server-apis';
import { BindingKeys } from './binding.keys';
import { ProfileUser } from './services';
const {SequenceActions} = RestBindings;


interface AuthenticateFn {
  (request: Request): Promise<ProfileUser>;
}

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

  private findDBNameOfRequest =
  (routePath: string, context: RequestContext, params: Array<{company: string}>, uProfile:ProfileUser) => {

    switch (routePath) {

    case INSTALL_API:
      if (process.env.COMMON_COMPANY_CODE) {

        context.bind(BindingKeys.SESSION_DB_NAME).to(process.env.COMMON_COMPANY_CODE);

      }
      return;
    case LOGIN_API:
      const [ uDetails ] = params;
      if (!uDetails.company) {

        throw new Error('Parameter company is missing');

      }
      context.bind(BindingKeys.SESSION_COMPANY_CODE).to(<string>uDetails.company.toLowerCase());
      return;

    }

    if (routePath.startsWith('/api-docs')) {

      return;

    }

    if (routePath.startsWith(USER_API) || routePath.startsWith(BRANCH_API)
     || routePath.startsWith(FIN_YEAR_API) || routePath.startsWith(COMPANY_API)) {

      if (uProfile?.company) {

        context.bind(BindingKeys.SESSION_COMPANY_CODE).to(<string>uProfile.company.toLowerCase());

      } else {

        throw new Error('Could not find company info from your session. Please login again.');

      }
      return;

    }
    if (uProfile?.company && uProfile?.branch && uProfile?.finYear) {

      context.bind(BindingKeys.SESSION_COMPANY_CODE).to(<string>uProfile.company.toLowerCase());
      const dbName = `${uProfile.company.toLowerCase()}_${uProfile.branch.toLowerCase()}_${uProfile.finYear.toLowerCase()}`;
      context.bind(BindingKeys.SESSION_DB_NAME).to(dbName);

    } else {

      throw new Error('Financial year is not selected. Please select one.');

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
      this.findDBNameOfRequest(route.path, context, args, uProfile);
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

      Object.assign(err, {statusCode: 422 });
      this.reject(context, err);

    }

  }

}
