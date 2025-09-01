"use client";

import { useRouter } from "next-nprogress-bar";
import { useActionState, useEffect } from "react";
import { Button, DatePicker, DateValue, Input, Textarea } from "@heroui/react";
import { addHours } from "date-fns";

import { MeetingRoom } from "~/meeting-room-booking-api";
import { parseDate, parseResult } from "~/helper/parse";

import { addBookingAction } from "./actions";

export function AddBookingForm({ id, name }: MeetingRoom) {
  // const { execute } = useStateAction(addBookingAction, {
  //   initResult: { data: { newName: "jane" } },
  // });
  const router = useRouter();
  const [handleState, handleFormAction, isPending] = useActionState(
    addBookingAction,
    {},
  );

  useEffect(() => {
    parseResult(handleState, router.back);
  }, [handleState]);

  return (
    <form
      action=""
      autoComplete="off"
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <Input
        isReadOnly
        className="hidden max-w-sm mb-4"
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
      {/* TODO: 点击选择日期报错,待适配 https://github.com/nextui-org/nextui/issues/3939 */}
      <DatePicker
        disableAnimation
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
        disableAnimation
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

      <Button
        fullWidth
        className="max-w-sm"
        color="primary"
        formAction={handleFormAction}
        isDisabled={isPending}
        type="submit"
        onKeyDown={(e) => {
          // https://github.com/nextui-org/nextui/issues/2074#issuecomment-2051057417
          if ("continuePropagation" in e) {
            e.continuePropagation();
          }
        }}
      >
        {isPending ? "预定中...`" : "预定"}
      </Button>
    </form>
  );
}
