"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { apiInstance } from "@/helper/auth";
import { SystemApi } from "@/meeting-room-booking-api";
import { actionClient } from "@/helper/safe-action";

const schema = z.object({
  id: z.coerce.number(),
});

export const frozenUserAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const systemApi = apiInstance(SystemApi);
    const text = await systemApi.freezeUser({ id: id });

    revalidatePath("/system/user");

    return { message: text ?? "冻结用户成功" };
  });
