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
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput }) => {
    const userApi = apiInstance(UserApi);

    const { auth } = await userApi.userLogin({ loginUserDto: parsedInput });

    await setAuthCookie(auth);
    // TODO: 验证成功后跳转
    redirect("/meeting-room");
  });

export async function clearCookie() {
  const cookieStore = cookies();

  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(EXPIRES_IN);
  cookieStore.delete(REFRESH_TOKEN);
}

export async function setAuthCookie({
  accessToken,
  refreshToken,
  expiresIn,
}: Auth) {
  const cookieStore = cookies();

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
  cookies().set(EXPIRES_IN, now.toString(), {
    httpOnly: true,
    sameSite: "lax",
    expires: now,
  });
}
