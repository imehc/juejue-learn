import { z } from "zod";

import { AddBookingForm } from "./form";

import { UnknownError } from "@/components/unknown-error";
import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi } from "@/meeting-room-booking-api";

const schema = z.object({
  params: z.object({
    meetingRoomId: z.coerce.number(),
  }),
});

export default async function AddBookingPage(path: unknown) {
  const payload = schema.safeParse(path);

  if (!payload.success) {
    return <UnknownError />;
  }

  const meetingRoomApi = apiInstance(MeetingRoomApi);
  const meetingRoom = await meetingRoomApi.findOneMeetingRoom({
    meetingRoomId: payload.data.params.meetingRoomId,
  });

  return <AddBookingForm {...meetingRoom} />;
}
