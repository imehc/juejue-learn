import { z } from "zod";
import { notFound } from "next/navigation";

import { MeetingRoomForm } from "@/components/meeting-room/form";
import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi } from "@/meeting-room-booking-api";

const schema = z.object({
  params: z.object({
    meetingRoomId: z.string(),
  }),
});

export default async function UpdateMeetingRoomPage(params: unknown) {
  const payload = schema.safeParse(params);

  if (!payload.success) {
    return notFound();
  }

  const meetingRoomApi = apiInstance(MeetingRoomApi);
  const meetingRoom = await meetingRoomApi.findOneMeetingRoom({
    id: payload.data.params.meetingRoomId,
  });

  return <MeetingRoomForm {...meetingRoom} />;
}
