import { notFound } from "next/navigation";

import { MeetingRoomForm } from "@/components/meeting-room";
import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi } from "@/meeting-room-booking-api";
import { z } from "@/helper/zod";

const schema = z.object({
  params: z.object({
    meetingRoomId: z.coerce.number(),
  }),
});

export default async function UpdateMeetingRoomPage(params: unknown) {
  const payload = schema.safeParse(params);

  if (!payload.success) {
    return notFound();
  }

  const meetingRoomApi = apiInstance(MeetingRoomApi);
  const meetingRoom = await meetingRoomApi.findOneMeetingRoom({
    meetingRoomId: payload.data.params.meetingRoomId,
  });

  return <MeetingRoomForm {...meetingRoom} />;
}
