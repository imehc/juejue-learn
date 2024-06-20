export const ACCESS_TOKEN = "access-token";
export const REFRESH_TOKEN = "refresh-token";
export const EXPIRES_IN = "expires-in";

export type AuthKey =
  | typeof ACCESS_TOKEN
  | typeof REFRESH_TOKEN
  | typeof EXPIRES_IN;
