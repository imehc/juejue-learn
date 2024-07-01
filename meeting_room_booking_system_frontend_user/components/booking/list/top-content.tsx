"use client";

import { DateValue } from "@internationalized/date";
import { Input } from "@nextui-org/input";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { forwardRef, useImperativeHandle, useTransition } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Button } from "@nextui-org/button";
import clsx from "clsx";

import { bookingListSchema } from "./schema";

import { BookingStatusEnum } from "@/meeting-room-booking-api";
import { parseDate } from "@/helper/parse-date";

interface Props {
  type: "system" | "normal";
}

export interface BookingListTopContentRef {
  skip: number;
  limit: number;
  stauts?: BookingStatusEnum;
  setQueryState: ReturnType<typeof useQueryStates>[1];
}

export const BookingListTopContent = forwardRef<
  BookingListTopContentRef,
  Props
>(function Child({ type }, ref) {
  const [, startTransition] = useTransition();
  const [
    { limit, skip, username, name, location, startAt, endAt, status },
    setQueryState,
  ] = useQueryStates(
    {
      limit: parseAsInteger.withDefault(10),
      skip: parseAsInteger.withDefault(0),
      username: parseAsString,
      name: parseAsString,
      location: parseAsString,
      status: parseAsStringEnum<BookingStatusEnum>(
        Object.values(BookingStatusEnum),
      ),
      startAt: parseAsIsoDateTime,
      endAt: parseAsIsoDateTime,
    },
    {
      shallow: false,
      startTransition,
    },
  );

  useImperativeHandle(
    ref,
    () => ({
      skip,
      limit,
      status,
      setQueryState,
    }),
    [limit, skip, setQueryState],
  );

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        className={clsx({ hidden: type === "normal" })}
        label="预定人"
        type="text"
        value={username ?? ""}
        onChange={(evt) => {
          setQueryState((state) => {
            return {
              ...state,
              username: bookingListSchema.shape.username.parse(
                evt.target.value,
              ),
              skip: 0,
            };
          });
        }}
      />
      <Input
        label="会议室名称"
        type="text"
        value={name ?? ""}
        onChange={(evt) => {
          setQueryState((state) => {
            return {
              ...state,
              name: bookingListSchema.shape.name.parse(evt.target.value),
              skip: 0,
            };
          });
        }}
      />
      <Input
        label="地址"
        type="text"
        value={location ?? ""}
        onChange={(evt) => {
          setQueryState((state) => {
            return {
              ...state,
              location: bookingListSchema.shape.location.parse(
                evt.target.value,
              ),
              skip: 0,
            };
          });
        }}
      />
      <DatePicker
        showMonthAndYearPickers
        className="max-w-[284px]"
        granularity="minute"
        label="开始时间"
        maxValue={parseDate(endAt) as DateValue}
        value={parseDate(startAt)}
        onChange={(evt) => {
          setQueryState((state) => {
            return {
              ...state,
              startAt: bookingListSchema.shape.startAt.parse(
                new Date(evt.toString()),
              ),
              skip: 0,
            };
          });
        }}
      />
      <DatePicker
        showMonthAndYearPickers
        className="max-w-[284px]"
        granularity="minute"
        label="结束时间"
        minValue={parseDate(startAt) as DateValue}
        value={parseDate(endAt)}
        onChange={(evt) => {
          setQueryState((state) => {
            return {
              ...state,
              endAt: bookingListSchema.shape.endAt.parse(
                new Date(evt.toString()),
              ),
              skip: 0,
            };
          });
        }}
      />
      <Button
        className="h-14"
        color="secondary"
        onClick={() => {
          setQueryState((state) => {
            return {
              ...state,
              username: null,
              name: null,
              location: null,
              startAt: null,
              endAt: null,
              skip: 0,
            };
          });
        }}
      >
        重置
      </Button>
    </div>
  );
});
