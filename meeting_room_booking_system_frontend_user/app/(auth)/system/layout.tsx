import { PropsWithChildren } from "react";
import { Card, CardBody } from "@nextui-org/card";

import { apiInstance } from "@/helper/auth";
import { UserApi } from "@/meeting-room-booking-api";
import { IllegalAccess } from "@/components/illegal-access";
import { SlideBar } from "@/components/sidebar";

export default async function SystemLayout({ children }: PropsWithChildren) {
  const userApi = apiInstance(UserApi);
  const user = await userApi.getUserInfo();

  if (!user.isAdmin) {
    return <IllegalAccess />;
  }

  return (
    <div className="flex justify-start w-full h-full">
      <div className="w-1/5 h-full min-w-36 max-w-56">
        <SlideBar />
      </div>
      <div className="w-4/5 h-full flex-1 ml-8 box-border">
        <Card className="h-full">
          <CardBody className="h-full">{children}</CardBody>
        </Card>
      </div>
    </div>
  );
}
