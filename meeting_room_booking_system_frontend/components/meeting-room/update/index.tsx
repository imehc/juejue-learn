import { notFound } from "next/navigation";

import { apiInstance } from "~/helper/auth";
import { z } from "~/helper/zod";
import { MeetingRoomApi } from "~/meeting-room-booking-api";
import type { BasicPageParams } from "~/types";

import { MeetingRoomForm } from "..";

const schema = z.object({
  meetingRoomId: z.coerce.number(),
});

export async function UpdateMeetingRoom(props: BasicPageParams) {
  const params = await props.params;
  const payload = schema.safeParse(params);

  if (!payload.success) {
    return notFound();
  }

  const meetingRoomApi = await apiInstance(MeetingRoomApi);
  const meetingRoom = await meetingRoomApi.findOneMeetingRoom({
    meetingRoomId: payload.data.meetingRoomId,
  });

  return <MeetingRoomForm {...meetingRoom} />;
}
