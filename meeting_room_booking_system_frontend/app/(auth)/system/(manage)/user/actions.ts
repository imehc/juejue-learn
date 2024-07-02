"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "@/helper/auth";
import { SystemApi, User } from "@/meeting-room-booking-api";

export async function frozenUser({ id }: Pick<User, "id">) {
  const systemApi = apiInstance(SystemApi);

  try {
    const text = await systemApi.freezeUser({ id: id });

    revalidatePath("/system/user");

    return { data: text };
  } catch (error) {
    return { data: "fail" };
  }
}
