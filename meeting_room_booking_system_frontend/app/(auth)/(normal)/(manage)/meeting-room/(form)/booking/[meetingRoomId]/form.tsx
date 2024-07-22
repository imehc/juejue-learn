"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { addHours } from "date-fns";
import { DateValue } from "@internationalized/date";
import { toast } from "sonner";

import { addBookingAction } from "./actions";

import { MeetingRoom } from "@/meeting-room-booking-api";
import { parseDate } from "@/helper/parse-date";

export function AddBookingForm({ id, name }: MeetingRoom) {
  // const { execute } = useStateAction(addBookingAction, {
  //   initResult: { data: { newName: "jane" } },
  // });
  const router = useRouter();
  const [handleState, handleFormAction] = useFormState(addBookingAction, {});

  useEffect(() => {
    if (handleState.data?.message) {
      toast.success(handleState.data.message);
      router.back();

      return;
    }
    if (handleState.serverError) {
      toast.error(handleState.serverError);

      return;
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
        errorMessage={handleState?.validationErrors?.startAt?.join(" ")}
        granularity="minute"
        isInvalid={!!handleState?.validationErrors?.startAt?.length}
        label="开始时间"
        minValue={parseDate(new Date()) as DateValue}
        name="startAt"
      />
      <DatePicker
        isRequired
        showMonthAndYearPickers
        className="max-w-sm mb-4"
        defaultValue={parseDate(addHours(new Date(), 3))}
        errorMessage={handleState?.validationErrors?.endAt?.join(" ")}
        granularity="minute"
        isInvalid={!!handleState?.validationErrors?.endAt?.length}
        label="结束时间"
        minValue={parseDate(new Date()) as DateValue}
        name="endAt"
      />
      <Textarea
        className="max-w-sm mb-4"
        errorMessage={handleState?.validationErrors?.remark?.join(" ")}
        isInvalid={!!handleState?.validationErrors?.remark?.length}
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
