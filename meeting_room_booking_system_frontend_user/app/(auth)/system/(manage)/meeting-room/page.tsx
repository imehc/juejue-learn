import { meetingRoomListSchema } from "./schema";
import { MeetingRoomList } from "./list";

import { apiInstance } from "@/helper/auth";
import { MeetingRoomApi } from "@/meeting-room-booking-api";

export default async function MeetingRoomPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const payload = meetingRoomListSchema.safeParse(searchParams);

  if (!payload.success) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        未知错误
      </div>
    );
  }
  const meetingRoomApi = apiInstance(MeetingRoomApi);
  const userList = await meetingRoomApi.findAllMettingRoom({
    ...payload.data,
    skip: payload.data.skip + 1,
  });

  return <MeetingRoomList {...userList} />;
}
