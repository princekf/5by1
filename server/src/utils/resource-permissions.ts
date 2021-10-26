const createResourceObj = (name: string, key: string, operation: string) => ({name,
  key,
  operation});
const resourcePs:Record<string, {name: string, key: string, operation: string}> = {

  commonResources: createResourceObj('common-resource', '', ''),
  branchCreate: createResourceObj('branch-create', 'branch', 'create'),
  userCreate: createResourceObj('user-create', 'user', 'create'),

};
export const resourcePermissions = resourcePs;
