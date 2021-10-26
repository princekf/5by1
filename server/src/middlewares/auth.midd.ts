import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata} from '@loopback/authorization';
import {securityId} from '@loopback/security';
import { ProfileUser } from '../services';

/*
 * Instance level authorizer
 * Can be also registered as an authorizer, depends on users' need.
 */
export const basicAuthorization = (
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): unknown => {

  // No access if authorization details are missing
  let currentUser: ProfileUser;
  if (authorizationCtx.principals.length > 0) {

    const [ {id, name, role, email, company} ] = authorizationCtx.principals;
    currentUser = {[securityId]: id,
      id,
      name,
      role,
      email,
      company};

  } else {

    return AuthorizationDecision.DENY;

  }

  if (!currentUser.role) {

    return AuthorizationDecision.DENY;

  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {

    return AuthorizationDecision.ALLOW;

  }

  if (metadata.allowedRoles?.includes(currentUser.role)) {

    return AuthorizationDecision.ALLOW;

  }

  return AuthorizationDecision.DENY;

};
