import { differenceInMinutes } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { AuthApi } from "@/meeting-room-booking-api";

export const ACCESS_TOKEN = "access-token";
export const REFRESH_TOKEN = "refresh-token";
export const EXPIRES_IN = "expires-in";

export type AuthKey =
  | typeof ACCESS_TOKEN
  | typeof REFRESH_TOKEN
  | typeof EXPIRES_IN;

export async function updateAuth(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
  const expiresIn = request.cookies.get(EXPIRES_IN)?.value;

  const res = NextResponse.next();

  if (!accessToken || !refreshToken || !expiresIn) {
    return clearCookie(res);
  }

  console.log(
    "Remaining expiration time: ",
    differenceInMinutes(new Date(+expiresIn), new Date()),
  );
  // 过期时间剩余五分钟时刷新token
  if (differenceInMinutes(new Date(+expiresIn), new Date()) < 5) {
    try {
      const authApi = new AuthApi();

      // 直接检查refreshToken是否有效
      await authApi.checkTokenExpiration({ token: refreshToken });
      const auth = await authApi.refreshToken({ refreshToken });

      const now = new Date().getTime() + auth.expiresIn;

      setCookie(res, ACCESS_TOKEN, auth.accessToken, now);
      setCookie(res, REFRESH_TOKEN, auth.refreshToken);
      setCookie(res, EXPIRES_IN, now.toString(), now);

      return res;
    } catch (error) {
      return clearCookie(res);
    }
  }

  return res;
}

// 清空cookie
function clearCookie(res: ReturnType<typeof NextResponse.next>) {
  setCookie(res, ACCESS_TOKEN, "", 0);
  setCookie(res, REFRESH_TOKEN, "", 0);
  setCookie(res, EXPIRES_IN, "", 0);

  return res;
}

function setCookie(
  res: ReturnType<typeof NextResponse.next>,
  key: AuthKey,
  value: string,
  expires?: number,
) {
  return res.cookies.set({
    name: key,
    value: value,
    httpOnly: true,
    expires: expires,
    sameSite: "lax",
  });
}
