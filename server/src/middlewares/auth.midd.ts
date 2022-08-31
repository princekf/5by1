import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata} from '@loopback/authorization';
import {securityId} from '@loopback/security';
import { UserRepository } from '../repositories';
import { ProfileUser } from '../services';
import { resourcePermissions } from '../utils/resource-permissions';

/*
 * Instance level authorizer
 * Can be also registered as an authorizer, depends on users' need.
 */
export const basicAuthorization = async(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<unknown> => {


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

  if (!currentUser.role || !metadata.allowedRoles || !metadata.allowedRoles?.includes(currentUser.role)) {

    return AuthorizationDecision.DENY;

  }

  if (currentUser.role === 'super-admin') {

    return AuthorizationDecision.ALLOW;

  }

  if (metadata.resource === resourcePermissions.commonResources.name) {

    return AuthorizationDecision.ALLOW;

  }

  const userRepository:UserRepository = authorizationCtx.invocationContext.getSync('repositories.UserRepository');
  const cUser = await userRepository.findById(currentUser.id);
  const [ main, operation ] = metadata.resource?.split('-') ?? [];
  const {permissions} = cUser;
  if (!permissions[main]?.operations[operation]) {

    return AuthorizationDecision.DENY;

  }


  return AuthorizationDecision.ALLOW;

};
