"use server";

import { redirect } from "next/navigation";
import { flattenValidationErrors } from "next-safe-action";

import { apiInstance } from "~/helper/auth";
import { actionClient } from "~/helper/safe-action";
import { SystemApi } from "~/meeting-room-booking-api";

import { setAuthCookie } from "../login/actions";

import { loginSchema } from "./schema";

export const systemLoginAction = actionClient
  .inputSchema(loginSchema, {
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
