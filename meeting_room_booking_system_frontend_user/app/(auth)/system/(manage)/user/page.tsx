import { UserList } from "./list";
import { userListSchema } from "./schema";

import { UnknownError } from "@/components/unknown-error";
import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";

export default async function SystemUserPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const payload = userListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError />;
  }
  const userApi = apiInstance(UserApi);
  const userList = await userApi.getUserList({
    ...payload.data,
    skip: payload.data.skip + 1,
  });

  return <UserList {...userList} />;
}
