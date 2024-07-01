import {
  MeetingRoomList,
  meetingRoomListSchema,
} from "@/components/meeting-room";
import { UnknownError } from "@/components/unknown-error";
import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi, UserApi } from "@/meeting-room-booking-api";

export default async function MeetingRoomPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const payload = meetingRoomListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError />;
  }
  const meetingRoomApi = apiInstance(MeetingRoomApi);
  const userApi = apiInstance(UserApi);
  const user = await userApi.getUserInfo();
  const userList = await meetingRoomApi.findAllMettingRoom({
    ...payload.data,
    skip: payload.data.skip + 1,
  });

  return (
    <MeetingRoomList {...userList} isFrozen={user.isFrozen} type="normal" />
  );
}
