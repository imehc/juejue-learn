import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN } from "./helper/cookie";

const jsonRegex = new RegExp(
  "^(:?application/json|[^;/ \\t]+/[^;/ \\t]+[+]json)[ \\t]*(:?;.*)?$",
  "i",
);

function isJson(text?: string | null) {
  return !!text && jsonRegex.test(text);
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // TODO: 更多需要清除cookie的场景
  if (pathname.startsWith("/login")) {
    request.cookies.clear();
    console.log("access-token exist: ", request.cookies.has(ACCESS_TOKEN));
  } else {
    if (!request.cookies.has(ACCESS_TOKEN)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // TODO: 处理token即将过期
  }

  const response = NextResponse.next();

  try {
    console.log(response.status);

    if (response.status >= 500) {
      return NextResponse.json(
        { success: false, message: "服务异常" },
        { status: 500 },
      );
    } else if (response.status >= 400 && response.status < 500) {
      if (response.status === 400) {
        if (isJson(response.headers.get("Content-Type"))) {
          const res: { message?: string } = await response.json();

          return NextResponse.json(
            { success: false, message: res.message ?? response.statusText },
            { status: 400 },
          );
        }

        const text = await response.text();

        return NextResponse.json(
          { success: false, message: text },
          { status: 400 },
        );
      }
      if (response.status == 401) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      return NextResponse.json(
        { success: false, message: "not found" },
        { status: 404 },
      );
    }

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
