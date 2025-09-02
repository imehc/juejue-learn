import { UnknownError } from "~/components/unknown-error";
import { apiInstance } from "~/helper/auth";
import { parseZodErr } from "~/helper/parse";
import { UserApi } from "~/meeting-room-booking-api";
import type { BasicPageParams } from "~/types";
import { UserList } from "./list";
import { userListSchema } from "./schema";

export default async function SystemUserPage(props: BasicPageParams) {
  const searchParams = await props.searchParams;
  const payload = userListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError msg={parseZodErr(payload)} />;
  }
  const userApi = await apiInstance(UserApi);
  const userList = await userApi.getUserList({
    ...payload.data,
    skip: payload.data.skip + 1,
  });

  return <UserList {...userList} />;
}
