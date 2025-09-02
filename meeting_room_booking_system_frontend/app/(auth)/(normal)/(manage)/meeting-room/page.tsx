import {
  MeetingRoomList,
  meetingRoomListSchema,
} from "~/components/meeting-room";
import { UnknownError } from "~/components/unknown-error";
import { apiInstance } from "~/helper/auth";
import { parseZodErr } from "~/helper/parse";
import { MeetingRoomApi, UserApi } from "~/meeting-room-booking-api";
import type { BasicPageParams } from "~/types";

export default async function MeetingRoomPage(props: BasicPageParams) {
  const searchParams = await props?.searchParams;
  const payload = meetingRoomListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError msg={parseZodErr(payload)} />;
  }
  const meetingRoomApi = await apiInstance(MeetingRoomApi);
  const userApi = await apiInstance(UserApi);
  const user = await userApi.getUserInfo();
  const userList = await meetingRoomApi.findAllMettingRoom({
    ...payload.data,
    skip: payload.data.skip + 1,
  });

  return (
    <MeetingRoomList {...userList} isFrozen={user.isFrozen} type="normal" />
  );
}
