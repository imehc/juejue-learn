"use server";

import { redirect } from "next/navigation";
import { flattenValidationErrors } from "next-safe-action";

import { setAuthCookie } from "../login/actions";

import { loginSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { SystemApi } from "@/meeting-room-booking-api";
import { actionClient } from "@/helper/safe-action";

export const systemLoginAction = actionClient
  .schema(loginSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput }) => {
    const systemApi = await apiInstance(SystemApi);

    const { auth } = await systemApi.systemLogin({
      loginUserDto: parsedInput,
    });

    await setAuthCookie(auth);
    // TODO: 验证成功后跳转
    redirect("/system/booking");
  });
