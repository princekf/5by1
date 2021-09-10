import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';

/*
 * Instance level authorizer
 * Can be also registered as an authorizer, depends on users' need.
 */
export const basicAuthorization = (
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): unknown => {

  // No access if authorization details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {

    const [ {id, name, role} ] = authorizationCtx.principals;
    currentUser = {[securityId]: id,
      name,
      role};

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

  let roleIsAllowed = false;
  if (metadata.allowedRoles?.includes(currentUser.role)) {

    roleIsAllowed = true;

  }

  if (!roleIsAllowed) {

    return AuthorizationDecision.DENY;

  }

  return AuthorizationDecision.ALLOW;

};
