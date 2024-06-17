import { UpdatePasswordForm } from "./form";

import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";

export default async function UpdatePasswordPage() {
  const userApi = apiInstance(UserApi);
  const userInfo = await userApi.getUserInfo();

  return <UpdatePasswordForm {...userInfo} />;
}
