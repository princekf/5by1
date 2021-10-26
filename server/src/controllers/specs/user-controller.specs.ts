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
