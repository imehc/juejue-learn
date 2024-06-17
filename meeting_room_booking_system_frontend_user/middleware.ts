import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN } from "./helper/cookie";

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
    // TODO: 处理token即将过期
  }

  const response = NextResponse.next();

  try {
    // console.log(response.status);

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
