"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DatePicker } from "@nextui-org/date-picker";
import { addHours } from "date-fns";
import { DateValue } from "@internationalized/date";

import { addBookingAction } from "./actions";

import { MeetingRoom } from "@/meeting-room-booking-api";
import { parseDate } from "@/helper/parse-date";

export function AddBookingForm({ id, name }: MeetingRoom) {
  const router = useRouter();
  const [handleState, handleFormAction] = useFormState(addBookingAction, {
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
      <Input
        isReadOnly
        className="max-w-sm mb-4 hidden"
        defaultValue={id?.toString()}
        label="会议室ID"
        name="meetingRoomId"
        type="text"
      />
      <Input
        isReadOnly
        isRequired
        className="max-w-sm mb-4"
        defaultValue={name}
        label="会议室名称"
        name="name"
        type="text"
      />
      <DatePicker
        isRequired
        showMonthAndYearPickers
        className="max-w-sm mb-4"
        defaultValue={parseDate(addHours(new Date(), 1))}
        errorMessage={handleState?.message?.startAt}
        granularity="minute"
        isInvalid={!!handleState?.message?.startAt}
        label="开始时间"
        minValue={parseDate(new Date()) as DateValue}
        name="startAt"
      />
      <DatePicker
        isRequired
        showMonthAndYearPickers
        className="max-w-sm mb-4"
        defaultValue={parseDate(addHours(new Date(), 3))}
        errorMessage={handleState?.message?.endAt}
        granularity="minute"
        isInvalid={!!handleState?.message?.endAt}
        label="结束时间"
        minValue={parseDate(new Date()) as DateValue}
        name="endAt"
      />
      <Textarea
        className="max-w-sm mb-4"
        errorMessage={handleState?.message?.remark}
        isInvalid={!!handleState?.message?.remark}
        label="备注"
        name="remark"
        placeholder="请填写备注"
      />

      <SubmitButton formAction={handleFormAction} />
    </form>
  );
}

function SubmitButton(props: ButtonProps) {
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
      {pending ? "预定中...`" : "预定"}
    </Button>
  );
}
