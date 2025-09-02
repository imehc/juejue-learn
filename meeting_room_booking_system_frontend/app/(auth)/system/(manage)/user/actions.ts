"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "~/helper/auth";
import { actionClient } from "~/helper/safe-action";
import { z } from "~/helper/zod";
import { SystemApi } from "~/meeting-room-booking-api";

const schema = z.object({
  id: z.coerce.number(),
});

export const frozenUserAction = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const systemApi = await apiInstance(SystemApi);
    const text = await systemApi.freezeUser({ id: id });

    revalidatePath("/system/user");

    return { message: text ?? "冻结用户成功" };
  });
