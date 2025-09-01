import { PasswordModifyForm } from "~/components/password-modify";
import { apiInstance } from "~/helper/auth";
import { UserApi } from "~/meeting-room-booking-api";

export default async function PasswordModifyPage() {
  const userApi = await apiInstance(UserApi);
  const userInfo = await userApi.getUserInfo();

  return <PasswordModifyForm {...userInfo} />;
}
