"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi } from "@/meeting-room-booking-api";
import { actionClient } from "@/helper/safe-action";

const schema = z.object({
  id: z.coerce.number({ required_error: "未选择会议室" }),
});

export const delMeetingRoomAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const meetingRoomApi = apiInstance(MeetingRoomApi);
    const text = await meetingRoomApi.delMeetingRoom({ meetingRoomId: id });

    revalidatePath("/system/meeting-room");

    return { message: text ?? "删除会议室成功" };
  });

export type DelMeetingRoomAction = typeof delMeetingRoomAction;
