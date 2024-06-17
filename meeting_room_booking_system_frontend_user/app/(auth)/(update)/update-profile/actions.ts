"use server";

import { revalidatePath } from "next/cache";

import { updateProfileSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { CaptchaApi, ResponseError, UserApi } from "@/meeting-room-booking-api";

interface State {
  message?: {
    captcha?: string;
  } | null;
  error?: string;
  success?: string;
}

export async function updateProfile(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const payload = updateProfileSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  console.log(111111);
  if (!payload.success) {
    console.log(payload.error.errors[0]);
    const captchaErr = payload.error.errors.find(
      (err) => err.path[0] === "captcha",
    )?.message;

    return {
      message: {
        captcha: captchaErr,
      },
    };
  }

  const file = formData.get("picture") as File | null;

  let headPic = payload.data.headPic;

  try {
    const userApi = apiInstance(UserApi);

    if (file?.size) {
      headPic = await userApi.uploadPicture({ file: file });
    }

    const success = await userApi.updateUserInfo({
      updateUserDto: { ...payload.data, headPic },
    });

    revalidatePath(success);

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "修改失败",
      };
    }
    console.error(error);

    return {
      error: "修改失败",
    };
  }
}

export async function updateProfileCaptcha(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const captchaApi = apiInstance(CaptchaApi);
    const success = await captchaApi.updatePasswordCaptcha();

    return { success };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "服务异常",
      };
    }

    return { error: "服务异常" };
  }
}
