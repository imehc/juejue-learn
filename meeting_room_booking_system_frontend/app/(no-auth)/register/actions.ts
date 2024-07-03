"use server";

import { registerSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { CaptchaApi, ResponseError, UserApi } from "@/meeting-room-booking-api";

interface State {
  message?: {
    username?: string;
    nickName?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    captcha?: string;
  } | null;
  error?: string;
  success?: string;
}

export async function register(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const payload = registerSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!payload.success) {
    const usernameErr = payload.error.errors.find(
      (err) => err.path[0] === "username",
    )?.message;
    const nickNameErr = payload.error.errors.find(
      (err) => err.path[0] === "nickName",
    )?.message;
    const passwordErr = payload.error.errors.find(
      (err) => err.path[0] === "password",
    )?.message;
    const confirmPasswordErr = payload.error.errors.find(
      (err) => err.path[0] === "confirmPassword",
    )?.message;
    const emailErr = payload.error.errors.find(
      (err) => err.path[0] === "email",
    )?.message;
    const captchaErr = payload.error.errors.find(
      (err) => err.path[0] === "captcha",
    )?.message;

    return {
      message: {
        username: usernameErr,
        nickName: nickNameErr,
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
        email: emailErr,
        captcha: captchaErr,
      },
    };
  }

  try {
    const userApi = apiInstance(UserApi);

    const success = await userApi.userRegister({
      registerUserDto: payload.data,
    });

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "注册失败",
      };
    }
    console.error(error);

    return {
      error: (error as Error)?.message || "注册失败",
    };
  }
}

export async function registerCaptcha(
  prevState: State,
  formData: FormData,
): Promise<State> {
  // input已限制，所以不需要再校验邮箱
  const email = formData.get("email") as string | undefined;

  if (!email) {
    return {
      error: "请输入邮箱地址",
    };
  }

  try {
    const captchaApi = apiInstance(CaptchaApi);
    const success = await captchaApi.registerCaptcha({ address: email });

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "服务异常",
      };
    }

    return { error: (error as Error)?.message || "服务异常" };
  }
}
