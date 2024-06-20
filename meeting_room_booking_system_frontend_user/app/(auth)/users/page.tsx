import { cookies } from "next/headers";

import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";

export default async function UserPage() {
  const userApi = apiInstance(UserApi);
  const userInfo = await userApi.getUserInfo();
  const cookieStore = cookies();

  // return (
  //   // TODO:
  //   <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10" />
  // );
  return (
    <>
      <div>{JSON.stringify(userInfo)}</div>
      <div>{userInfo.type}</div>
      {cookieStore.getAll().map((cookie) => (
        <div key={cookie.name}>
          <p>Name: {cookie.name}</p>
          <p>Value: {cookie.value}</p>
        </div>
      ))}
    </>
  );
}
