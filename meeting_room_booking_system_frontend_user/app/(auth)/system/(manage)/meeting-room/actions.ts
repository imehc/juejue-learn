"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "@/helper/auth";
import { MeetingRoom, MeetingRoomApi } from "@/meeting-room-booking-api";

export async function delMeetingRoom({ id }: Pick<MeetingRoom, "id">) {
  const meetingRoomApi = apiInstance(MeetingRoomApi);

  try {
    const text = await meetingRoomApi.delMeetingRoom({ id: id });

    revalidatePath("/system/meeting-room");

    return { data: text };
  } catch (error) {
    return { data: "fail" };
  }
}
