import { ProfileModifyForm } from "@/components/profile-modify";
import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";

export default async function ProfileModify() {
  const userApi = await apiInstance(UserApi);
  const userInfo = await userApi.getUserInfo();

  return <ProfileModifyForm {...userInfo} />;
}
