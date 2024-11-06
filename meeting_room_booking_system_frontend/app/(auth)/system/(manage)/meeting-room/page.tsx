import { delMeetingRoomAction } from "./actions";

import {
  MeetingRoomList,
  meetingRoomListSchema,
} from "@/components/meeting-room";
import { UnknownError } from "@/components/unknown-error";
import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi } from "@/meeting-room-booking-api";
import { BasicPageParams } from "@/types";

export default async function MeetingRoomPage(props: BasicPageParams) {
  const searchParams = await props?.searchParams;
  const payload = meetingRoomListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError />;
  }
  const meetingRoomApi = await apiInstance(MeetingRoomApi);
  const userList = await meetingRoomApi.findAllMettingRoom({
    ...payload.data,
    skip: payload.data.skip + 1,
  });

  return (
    <MeetingRoomList
      {...userList}
      delMeetingRoom={delMeetingRoomAction}
      type="system"
    />
  );
}
