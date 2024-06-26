"use server";

import { revalidatePath } from "next/cache";

import { meetingRoomFormSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi, ResponseError } from "@/meeting-room-booking-api";

interface State {
  message?: {
    name?: string;
    capacity?: string;
    location?: string;
    equipment?: string;
    description?: string;
  } | null;
  error?: string;
  success?: string;
}

export async function meetingRoomAction(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const id = formData.get("id");

  const payload = meetingRoomFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!payload.success) {
    const nameErr = payload.error.errors.find(
      (err) => err.path[0] === "name",
    )?.message;
    const capacityErr = payload.error.errors.find(
      (err) => err.path[0] === "capacity",
    )?.message;
    const locationErr = payload.error.errors.find(
      (err) => err.path[0] === "location",
    )?.message;
    const equipmentErr = payload.error.errors.find(
      (err) => err.path[0] === "equipment",
    )?.message;
    const descriptionErr = payload.error.errors.find(
      (err) => err.path[0] === "description",
    )?.message;

    return {
      message: {
        name: nameErr,
        capacity: capacityErr,
        location: locationErr,
        equipment: equipmentErr,
        description: descriptionErr,
      },
    };
  }

  const hasCreate = !id || typeof +id !== "number";

  try {
    const meetingRoomApi = apiInstance(MeetingRoomApi);

    if (hasCreate) {
      const text = await meetingRoomApi.createMeetingRoom({
        createMeetingRoomDto: payload.data,
      });

      return {
        success: text ?? hasCreate ? "会议室创建成功" : "会议室创建失败",
      };
    } else {
      const text = await meetingRoomApi.updateMeetingRoom({
        meetingRoomId: +id,
        updateMeetingRoomDto: payload.data,
      });

      revalidatePath("/system/meeting-room");

      return {
        success: text ?? hasCreate ? "会议室更新成功" : "会议室更新失败",
      };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? hasCreate ? "会议室创建失败" : "会议室更新失败",
      };
    }

    return {
      error:
        (error as Error)?.message || hasCreate
          ? "会议室创建失败"
          : "会议室更新失败",
    };
  }
}
