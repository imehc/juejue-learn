import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { differenceInMinutes } from "date-fns";
import { redirect } from "next/navigation";

import { ACCESS_TOKEN, EXPIRES_IN, REFRESH_TOKEN } from "./helper/cookie";
import { AuthApi } from "./meeting-room-booking-api";

const noAuthPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/system-login",
];

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest, res: NextResponse) {
  const pathname = req.nextUrl.pathname;

  // TODO: 更多需要清除cookie的场景
  if (noAuthPaths.some((path) => pathname.startsWith(path))) {
    // 客户端也清除
    req.cookies.clear();

    // console.log("access-token exist: ", req.cookies.has(ACCESS_TOKEN));
  } else {
    if (!req.cookies.has(ACCESS_TOKEN)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // await authMiddleware(req);
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

/**
 * 参考
 * @link https://www.reddit.com/r/nextjs/comments/18955c2/issue_updating_nextjs_13_cookie_in_middleware/
 */
const authMiddleware = async (req: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;
  const expiresIn = cookieStore.get(EXPIRES_IN)?.value;

  if (!accessToken || !refreshToken || !expiresIn) {
    redirect("/login");
  }

  // 过期时间小于5分钟
  if (differenceInMinutes(new Date(+expiresIn), new Date()) < 5) {
    try {
      const authApi = new AuthApi();

      // 直接检查refreshToken是否有效
      await authApi.checkTokenExpiration({ token: refreshToken });
      const auth = await authApi.refreshToken({ refreshToken });

      const now = new Date().getTime() + auth.expiresIn;
      //由于无法设置cookie也不可以
      const response = NextResponse.next();

      return response;
    } catch (error) {
      return redirect("/login");
    }
  }
};
