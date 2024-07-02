"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { meetingRoomAction } from "./actions";

import { MeetingRoom } from "@/meeting-room-booking-api";

export function MeetingRoomForm({
  id,
  name,
  capacity,
  location,
  equipment,
  description,
}: Partial<MeetingRoom>) {
  const router = useRouter();
  const [handleState, handleFormAction] = useFormState(meetingRoomAction, {
    message: null,
  });

  useEffect(() => {
    if (handleState?.error) {
      toast.error(handleState.error);
    }
    if (handleState?.success) {
      toast.success(handleState.success);
      router.back();
    }
  }, [handleState]);

  return (
    <form
      action=""
      autoComplete="off"
      className="w-full h-full flex justify-center items-center flex-col"
    >
      {/* <h1 className="flex justify-start items-center font-bold text-2xl gap-1 mb-2">
        {!!id ? "更新会议室" : "创建会议室"}
      </h1> */}
      <Input
        // isDisabled //设置该选项formData无法读取
        isReadOnly
        className="max-w-sm mb-4 hidden"
        defaultValue={id?.toString()}
        label="会议室ID"
        name="id"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        defaultValue={name}
        errorMessage={handleState?.message?.name}
        isInvalid={!!handleState?.message?.name}
        label="会议室名称"
        name="name"
        type="text"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        defaultValue={capacity?.toString()}
        errorMessage={handleState?.message?.capacity}
        isInvalid={!!handleState?.message?.capacity}
        label="容纳人数"
        name="capacity"
        type="number"
      />
      <Input
        isRequired
        className="max-w-sm mb-4"
        defaultValue={location}
        errorMessage={handleState?.message?.location}
        isInvalid={!!handleState?.message?.location}
        label="地址"
        name="location"
        type="text"
      />
      <Input
        className="max-w-sm mb-4"
        defaultValue={equipment}
        errorMessage={handleState?.message?.equipment}
        isInvalid={!!handleState?.message?.equipment}
        label="设备名称"
        name="equipment"
        type="text"
      />
      <Input
        className="max-w-sm mb-4"
        defaultValue={description}
        errorMessage={handleState?.message?.description}
        isInvalid={!!handleState?.message?.description}
        label="描述"
        name="description"
        type="text"
      />

      <SubmitButton formAction={handleFormAction} hasUpdated={!!id} />
    </form>
  );
}

function SubmitButton({
  hasUpdated,
  ...props
}: ButtonProps & { hasUpdated: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      fullWidth
      className="max-w-sm"
      color="primary"
      isDisabled={pending}
      type="submit"
      {...props}
    >
      {pending
        ? `${hasUpdated ? "更新" : "创建"}中...`
        : hasUpdated
          ? "更新"
          : "创建"}
    </Button>
  );
}
