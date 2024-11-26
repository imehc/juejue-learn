const REDIS_ClIENT = 'REDIS_CLIENT' as const;

const CREATED = 'CREATED' as const;

const AUTH = {
  JWT: 'jwt',
  JWT_REFRESH: 'jwt-refresh',
} as const;

export { CREATED, REDIS_ClIENT, AUTH };
