"use server";

import { apiInstance } from "@/helper/auth";
import { MeetingRoom, MeetingRoomApi } from "@/meeting-room-booking-api";

export async function subscribeMeetingRoom({ id }: Pick<MeetingRoom, "id">) {
  const meetingRoomApi = apiInstance(MeetingRoomApi);

  try {
    throw new Error("unrealized");
  } catch (error) {
    return { data: "fail" };
  }
}
