"use server";

import { revalidatePath } from "next/cache";
import { flattenValidationErrors } from "next-safe-action";

import { apiInstance } from "~/helper/auth";
import { MeetingRoomApi } from "~/meeting-room-booking-api";
import { actionClient } from "~/helper/safe-action";

import { meetingRoomFormSchema } from "./schema";

export const meetingRoomAction = actionClient
  .inputSchema(meetingRoomFormSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction(async ({ parsedInput: { id, ...props } }) => {
    const meetingRoomApi = await apiInstance(MeetingRoomApi);

    if (!id) {
      const text = await meetingRoomApi.createMeetingRoom({
        createMeetingRoomDto: props,
      });

      revalidatePath("/system/meeting-room");

      return {
        message: text ?? "会议室创建成功",
      };
    } else {
      const text = await meetingRoomApi.updateMeetingRoom({
        meetingRoomId: id,
        updateMeetingRoomDto: props,
      });

      revalidatePath("/system/meeting-room");

      return {
        message: text ?? "会议室更新成功",
      };
    }
  });
