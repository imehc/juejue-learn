"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { loginSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { ACCESS_TOKEN, EXPIRES_IN, REFRESH_TOKEN } from "@/helper/cookie";
import { Auth, ResponseError, UserApi } from "@/meeting-room-booking-api";

interface State {
  message?: {
    username?: string;
    password?: string;
  } | null;
  error?: string;
}

export async function login(
  prevState: State,
  formData: FormData,
): Promise<State> {
  // const username = formData.get("username");
  // const password = formData.get("password");

  const payload = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!payload.success) {
    const usernameErr = payload.error.errors.find(
      (err) => err.path[0] === "username",
    )?.message;
    const passwordErr = payload.error.errors.find(
      (err) => err.path[0] === "password",
    )?.message;

    return {
      message: {
        username: usernameErr,
        password: passwordErr,
      },
    };
  }

  try {
    const userApi = apiInstance(UserApi);

    const { auth } = await userApi.userLogin({ loginUserDto: payload.data });

    await setAuthCookie(auth);
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "账号或密码错误",
      };
    }

    return {
      error: (error as Error)?.message || "账号或密码错误",
    };
  }
  // TODO: 验证成功后跳转
  redirect("/");
}

export async function clearCookie() {
  const cookieStore = cookies();

  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(EXPIRES_IN);
  cookieStore.delete(REFRESH_TOKEN);
}

async function setAuthCookie({ accessToken, refreshToken, expiresIn }: Auth) {
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
