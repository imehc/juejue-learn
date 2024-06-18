import { NextRequest, NextResponse } from "next/server";

import { setAuthCookie } from "../../login/actions";

import { AuthApi } from "@/meeting-room-booking-api";
import { REFRESH_TOKEN } from "@/helper/cookie";

export async function GET(req: NextRequest) {
  const refreshToken = req.nextUrl.searchParams.get(REFRESH_TOKEN);

  if (!refreshToken) {
    throw new Error("服务异常，请稍后重试");
  }
  try {
    const authApi = new AuthApi();
    const auth = await authApi.refreshToken({ refreshToken });

    await setAuthCookie(auth);

    return NextResponse.json({ accessToken: auth.accessToken });
  } catch (error) {
    throw new Error("服务异常，请稍后重试");
  }
}
