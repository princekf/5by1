export const HTTP_RESPONSE_CODE = {
  HTTP_OK: 200,
  HTTP_BAD_REQUEST: 400,
  FORBIDDEN_USER: 401,
  INTERNAL_SERVER_ERROR: 500,
  HTTP_NOT_FOUND: 404,
  HTTP_REDIRECT: 301,
};

// Should not give underscore _ in header key. It might cause while we deal with reverse proxy.
export const ACCESS_TOKEN_ID = 'ACCESSTOKEN';
export const GUEST_NAME = 'GUESTNAME';
export const GUEST_URL = 'GUESTURL';
export const MEDIA_LINK = '/api/medias/';

export interface DeviceDetails {
  deviceId: string,
  MAC: string
}
