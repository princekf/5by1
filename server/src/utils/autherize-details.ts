import { AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { basicAuthorization } from '../middlewares/auth.midd';

export const allRoleAuthDetails = {
  allowedRoles: [ 'admin', 'user', 'super-admin' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
};
export const adminAndUserAuthDetails = {
  allowedRoles: [ 'admin', 'user' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
};
export const adminOnlyAuthDetails = {
  allowedRoles: [ 'admin' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
};
export const superAdminAuthDetails = {
  allowedRoles: [ 'super-admin' ],
  voters: [ basicAuthorization as Authorizer<AuthorizationMetadata> ],
};
