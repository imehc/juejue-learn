"use server";

import { URL } from "url";

import { revalidatePath } from "next/cache";

import { profileModifySchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import {
  CaptchaApi,
  FileApi,
  ResponseError,
  UserApi,
} from "@/meeting-room-booking-api";

interface State {
  message?: {
    captcha?: string;
  } | null;
  error?: string;
  success?: string;
}

export async function profileModify(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const payload = profileModifySchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!payload.success) {
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
    const fileApi = apiInstance(FileApi);

    if (file?.size) {
      // 上传搭配静态文件夹
      // headPic = await fileApi.uploadPicture({ file: file });

      // 使用OSS对象存储
      const { presignedPutUrl } = await fileApi.getPresignedUrl();
      const payload = new Blob([file as File], {
        type: "application/octet-stream",
      });

      await fetch(presignedPutUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: payload,
      });
      const parsedUrl = new URL(presignedPutUrl);

      headPic = parsedUrl.pathname;
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
      error: (error as Error)?.message || "修改失败",
    };
  }
}

export async function profileModifyCaptcha(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const captchaApi = apiInstance(CaptchaApi);
    const success = await captchaApi.updateUserInfoCaptcha();

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
