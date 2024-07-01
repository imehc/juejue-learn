"use client";

import { DatePicker } from "@nextui-org/date-picker";

export function Statistics() {
  return (
    <div className="h-full">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <DatePicker
          showMonthAndYearPickers
          className="max-w-[284px]"
          granularity="minute"
          label="开始时间"
          // maxValue={parseDate(endAt) as DateValue}
          // value={parseDate(startAt)}
          onChange={(evt) => {
            // setQueryState((state) => {
            //   return {
            //     ...state,
            //     startAt: bookingListSchema.shape.startAt.parse(
            //       new Date(evt.toString()),
            //     ),
            //     skip: 0,
            //   };
            // });
          }}
        />
        <DatePicker
          showMonthAndYearPickers
          className="max-w-[284px]"
          granularity="minute"
          label="结束时间"
          // minValue={parseDate(startAt) as DateValue}
          // value={parseDate(endAt)}
          onChange={(evt) => {
            // setQueryState((state) => {
            //   return {
            //     ...state,
            //     endAt: bookingListSchema.shape.endAt.parse(
            //       new Date(evt.toString()),
            //     ),
            //     skip: 0,
            //   };
            // });
          }}
        />
      </div>
    </div>
  );
}
