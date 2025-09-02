import { Card, CardBody } from "@heroui/card";
import type { PropsWithChildren } from "react";

import { SlideBar } from "~/components/sidebar";
import { apiInstance } from "~/helper/auth";
import { UserApi } from "~/meeting-room-booking-api";

export default async function UpdateLayout({ children }: PropsWithChildren) {
  const userApi = await apiInstance(UserApi);
  const user = await userApi.getUserInfo();

  return (
    <div className="flex justify-start w-full h-full">
      <div className="w-1/5 h-full min-w-36 max-w-56">
        <SlideBar isAdmin={user.isAdmin} type="update" />
      </div>
      <div className="w-4/5 h-full flex-1 ml-8 box-border">
        <Card className="h-full">
          <CardBody className="h-full">{children}</CardBody>
        </Card>
      </div>
    </div>
  );
}
