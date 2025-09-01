import { PropsWithChildren } from "react";

import { apiInstance } from "~/helper/auth";
import { UserApi } from "~/meeting-room-booking-api";
import { IllegalAccess } from "~/components/illegal-access";

export default async function SystemLayout({ children }: PropsWithChildren) {
  const userApi = await apiInstance(UserApi);
  const user = await userApi.getUserInfo();

  if (!user.isAdmin) {
    return <IllegalAccess />;
  }

  return children;
}
