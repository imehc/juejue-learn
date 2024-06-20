import { UserList } from "./list";
import { userListSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";

export default async function SystemUserPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const payload = userListSchema.safeParse(searchParams);

  if (!payload.success) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        未知错误
      </div>
    );
  }
  const userApi = apiInstance(UserApi);
  const userList = await userApi.getUserList(payload.data);

  return <UserList {...userList} />;
}
