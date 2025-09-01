import { UnknownError } from "~/components/unknown-error";
import { apiInstance } from "~/helper/auth";
import { parseZodErr } from "~/helper/parse";
import { z } from "~/helper/zod";
import { MeetingRoomApi } from "~/meeting-room-booking-api";
import { BasicPageParams } from "~/types";

import { AddBookingForm } from "..";

const schema = z.object({
  meetingRoomId: z.coerce.number(),
});

export async function AddBooking(props: BasicPageParams) {
  const params = await props.params;
  const payload = schema.safeParse(params);

  if (!payload.success) {
    return <UnknownError msg={parseZodErr(payload)} />;
  }

  const meetingRoomApi = await apiInstance(MeetingRoomApi);
  const meetingRoom = await meetingRoomApi.findOneMeetingRoom({
    meetingRoomId: payload.data.meetingRoomId,
  });

  return <AddBookingForm {...meetingRoom} />;
}
