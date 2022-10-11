import { RequestBodyObject, SchemaObject } from 'openapi3-ts';

export const UserProfileSchema = {
  type: 'object',
  required: [ 'id' ],
  properties: {
    id: {type: 'string'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: [ 'email', 'password' ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    company: {
      type: 'string',
      minLength: 3,
    },
  },
};

const InstallSchema: SchemaObject = {
  type: 'object',
  required: [ 'installSecret' ],
  properties: {
    installSecret: {
      type: 'string',
      minLength: 8,
    },
  },
};

const ChangePasswordSchema: SchemaObject = {
  type: 'object',
  required: [ 'password' ],
  properties: {
    installSecret: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody: Partial<RequestBodyObject> = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export const InstallRequestBody: Partial<RequestBodyObject> = {
  description: 'The input of install function',
  required: true,
  content: {
    'application/json': {schema: InstallSchema},
  },
};
export const ChangePasswordRequestBody: Partial<RequestBodyObject> = {
  description: 'The input for change password',
  required: true,
  content: {
    'application/json': {schema: ChangePasswordSchema},
  },
};

export const AuthResponseSchema = {
  type: 'object',
  properties: {
    token: {type: 'string'},
  },
};

export const InstallResponseSchema = {
  type: 'object',
  properties: {
    message: {type: 'string'},
  },
};

export const ChangePasswordResponseSchema = {
  type: 'object',
  properties: {
    message: {type: 'string'},
  },
};

const SwitchFinYearSchema: SchemaObject = {
  type: 'object',
  required: [ 'finYearId' ],
  properties: {
    finYearId: {
      type: 'string',
    },
  },
};

export const SwitchFinYearRequestBody: Partial<RequestBodyObject> = {
  description: 'The input of switch fin year function',
  required: true,
  content: {
    'application/json': {schema: SwitchFinYearSchema},
  },
};

export const SwitchFinYearResponseSchema = {
  type: 'object',
  properties: {
    token: {type: 'string'},
  },
};

const SignupSchema: SchemaObject = {
  type: 'object',
  required: [ 'email', 'name', 'answer' ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    answer: {
      type: 'string',
    },
  },
};

export const SignupRequestBody: Partial<RequestBodyObject> = {
  description: 'The input of sign-up function',
  required: true,
  content: {
    'application/json': {schema: SignupSchema},
  },
};
