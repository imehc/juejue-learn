"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import {
  ACCESS_TOKEN,
  EXPIRES_IN,
  REFRESH_TOKEN,
  setAuthCookie,
} from "@/helper/cookie";
import { ResponseError, UserApi } from "@/meeting-room-booking-api";

interface State {
  message?: {
    username?: string;
    password?: string;
  } | null;
  error?: string;
}

export async function systemLogin(
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

    const {
      auth: { accessToken, refreshToken, expiresIn },
    } = await userApi.userLogin({ loginUserDto: payload.data });

    // TODO: 集中处理
    setAuthCookie(ACCESS_TOKEN, accessToken);
    setAuthCookie(REFRESH_TOKEN, refreshToken);
    setAuthCookie(EXPIRES_IN, expiresIn);
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "账号或密码错误",
      };
    }
    console.error(error);

    return {
      error: "账号或密码错误",
    };
  }
  // TODO: 验证成功后跳转
  redirect("/");
}
