import { cookies } from "next/headers";

export const ACCESS_TOKEN = "access-token";
export const REFRESH_TOKEN = "refresh-token";
export const EXPIRES_IN = "expires-in";

type AuthKey = typeof ACCESS_TOKEN | typeof REFRESH_TOKEN | typeof EXPIRES_IN;

export function setAuthCookie(key: AuthKey, v: string | number) {
  switch (key) {
    case EXPIRES_IN:
      cookies().set(key, (new Date().getTime() + (v as number)).toString(), {
        httpOnly: true,
        sameSite: "lax",
      });
      break;

    default:
      cookies().set(key, v.toString(), { httpOnly: true, sameSite: "lax" });
      break;
  }
}

export function getAuthCookie(key: AuthKey) {
  return cookies().get(key)?.value;
}

export function delAuthCookie(key: AuthKey) {
  cookies().delete(key);
}
