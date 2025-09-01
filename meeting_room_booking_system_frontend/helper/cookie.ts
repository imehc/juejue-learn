import { differenceInMinutes } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { AuthApi, BASE_PATH } from "~/meeting-room-booking-api";

export const ACCESS_TOKEN = "access-token";
export const REFRESH_TOKEN = "refresh-token";
export const EXPIRES_IN = "expires-in";

// 生产环境修改为容器的地址，否则请求不到
export const basePath =
  process.env.NODE_ENV === "production" ? "http://nginx/api" : BASE_PATH;

export type AuthKey =
  | typeof ACCESS_TOKEN
  | typeof REFRESH_TOKEN
  | typeof EXPIRES_IN;

/** TODO: 如何在长时间不操作的情况下且refresh-token未过期处理优雅刷新access-token */
export async function updateAuth(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
  const expiresIn = request.cookies.get(EXPIRES_IN)?.value;

  const res = NextResponse.next();

  if (!accessToken || !refreshToken || !expiresIn) {
    return clearCookie(res);
  }

  // eslint-disable-next-line no-console
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
    } catch {
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
