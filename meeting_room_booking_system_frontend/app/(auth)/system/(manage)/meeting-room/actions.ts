"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "~/helper/auth";
import { MeetingRoomApi } from "~/meeting-room-booking-api";
import { actionClient } from "~/helper/safe-action";
import { z } from "~/helper/zod";

const schema = z.object({
  id: z.coerce.number({ error: "未选择会议室" }),
});

export const delMeetingRoomAction = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const meetingRoomApi = await apiInstance(MeetingRoomApi);
    const text = await meetingRoomApi.delMeetingRoom({ meetingRoomId: id });

    revalidatePath("/system/meeting-room");

    return { message: text ?? "删除会议室成功" };
  });

export type DelMeetingRoomAction = typeof delMeetingRoomAction;
