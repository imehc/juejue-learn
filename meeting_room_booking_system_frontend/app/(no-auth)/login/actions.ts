"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { flattenValidationErrors } from "next-safe-action";

import { loginSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { ACCESS_TOKEN, EXPIRES_IN, REFRESH_TOKEN } from "@/helper/cookie";
import { Auth, UserApi } from "@/meeting-room-booking-api";
import { actionClient } from "@/helper/safe-action";

export const loginAction = actionClient
  .schema(loginSchema, {
    // TODO: https://github.com/TheEdoRan/next-safe-action/issues/288#issuecomment-2438651208
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput }) => {
    const userApi = await apiInstance(UserApi);

    const { auth } = await userApi.userLogin({ loginUserDto: parsedInput });

    await setAuthCookie(auth);
    // TODO: 验证成功后跳转
    redirect("/meeting-room");
  });

export async function clearCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(EXPIRES_IN);
  cookieStore.delete(REFRESH_TOKEN);
}

export async function setAuthCookie({
  accessToken,
  refreshToken,
  expiresIn,
}: Auth) {
  const cookieStore = await cookies();

  const now = new Date().getTime() + expiresIn;

  cookieStore.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    expires: now,
  });

  cookieStore.set(REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
  });
  cookieStore.set(EXPIRES_IN, now.toString(), {
    httpOnly: true,
    sameSite: "lax",
    expires: now,
  });
}
