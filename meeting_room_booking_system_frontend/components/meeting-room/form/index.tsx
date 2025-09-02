"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRouter } from "next-nprogress-bar";
import { useActionState, useEffect } from "react";
import { parseResult } from "~/helper/parse";
import type { MeetingRoom } from "~/meeting-room-booking-api";
import { meetingRoomAction } from "./actions";

export function MeetingRoomForm({
  id,
  name,
  capacity,
  location,
  equipment,
  description,
}: Partial<MeetingRoom>) {
  const router = useRouter();
  const [handleState, handleFormAction, isPending] = useActionState(
    meetingRoomAction,
    {},
  );

  useEffect(() => {
    parseResult(handleState, router.back);
  }, [handleState, router.back]);

  return (
    <form
      action=""
      autoComplete="off"
      className="flex flex-col items-center justify-center w-full h-full"
    >
      {/* <h1 className="flex items-center justify-start gap-1 mb-2 text-2xl font-bold">
        {!!id ? "更新会议室" : "创建会议室"}
      </h1> */}
      <Input
        // isDisabled //设置该选项formData无法读取
        isReadOnly
        className="hidden max-w-sm mb-4"
        defaultValue={id?.toString()}
        label="会议室ID"
        name="id"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        defaultValue={name}
        errorMessage={handleState?.validationErrors?.name?.join(" ")}
        isInvalid={!!handleState?.validationErrors?.name?.length}
        label="会议室名称"
        name="name"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        defaultValue={capacity?.toString()}
        errorMessage={handleState?.validationErrors?.capacity?.join(" ")}
        isInvalid={!!handleState?.validationErrors?.capacity?.length}
        label="容纳人数"
        name="capacity"
        type="number"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        defaultValue={location}
        errorMessage={handleState?.validationErrors?.location?.join(" ")}
        isInvalid={!!handleState?.validationErrors?.location?.length}
        label="地址"
        name="location"
        type="text"
      />
      <Input
        className="max-w-sm mb-4"
        defaultValue={equipment}
        errorMessage={handleState?.validationErrors?.equipment?.join(" ")}
        isInvalid={!!handleState?.validationErrors?.equipment?.length}
        label="设备名称"
        name="equipment"
        type="text"
      />
      <Input
        className="max-w-sm mb-4"
        defaultValue={description}
        errorMessage={handleState?.validationErrors?.description?.join(" ")}
        isInvalid={!!handleState?.validationErrors?.description?.length}
        label="描述"
        name="description"
        type="text"
      />

      <Button
        fullWidth
        className="max-w-sm"
        color="primary"
        formAction={handleFormAction}
        isDisabled={isPending}
        type="submit"
      >
        {isPending ? `${id ? "更新" : "创建"}中...` : id ? "更新" : "创建"}
      </Button>
    </form>
  );
}
