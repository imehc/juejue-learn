import { UpdateProfileForm } from "./form";

import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";

export default async function UpdateProfile() {
  const userApi = apiInstance(UserApi);
  const userInfo = await userApi.getUserInfo();

  return <UpdateProfileForm {...userInfo} />;
}
