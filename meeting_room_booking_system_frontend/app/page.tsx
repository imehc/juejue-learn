import { redirect } from "next/navigation";

import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";

export default async function Home() {
  const userApi = await apiInstance(UserApi);
  const user = await userApi.getUserInfo();

  if (user.isAdmin) {
    return redirect("/system/meeting-room");
  }

  return redirect("/meeting-room");
}
