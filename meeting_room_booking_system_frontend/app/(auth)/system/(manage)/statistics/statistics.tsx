"use client";

import { DateValue } from "@internationalized/date";
import { DatePicker, Select, SelectItem } from "@heroui/react";
import { parseAsIsoDateTime, parseAsStringEnum, useQueryStates } from "nuqs";
import { useTransition } from "react";

import { LineChart, PieChart } from "~/components/chart";
import { StatisticCountVo } from "~/meeting-room-booking-api";
import { parseDate } from "~/helper/parse";

import { chartTypes, statisticsSchema } from "./schema";

interface Props {
  userBooking: StatisticCountVo[];
  meetingRoomUsed: StatisticCountVo[];
}

export function Statistics({ userBooking, meetingRoomUsed }: Props) {
  const [, startTransition] = useTransition();
  const [{ startAt, endAt, chartType }, setQueryState] = useQueryStates(
    {
      startAt: parseAsIsoDateTime,
      endAt: parseAsIsoDateTime,
      chartType: parseAsStringEnum(chartTypes.map((item) => item.key)),
    },
    {
      shallow: false,
      startTransition,
    },
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <DatePicker
          disableAnimation
          showMonthAndYearPickers
          className="max-w-sm"
          granularity="minute"
          label="开始时间"
          maxValue={parseDate(endAt || new Date()) as DateValue}
          value={parseDate(startAt)}
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                startAt: statisticsSchema.shape.startAt.parse(evt?.toString()),
              };
            });
          }}
        />
        <DatePicker
          disableAnimation
          showMonthAndYearPickers
          className="max-w-sm"
          granularity="minute"
          label="结束时间"
          maxValue={parseDate(new Date()) as DateValue}
          minValue={parseDate(startAt) as DateValue}
          value={parseDate(endAt)}
          onChange={(evt) => {
            setQueryState((state) => {
              return {
                ...state,
                endAt: statisticsSchema.shape.endAt.parse(evt?.toString()),
              };
            });
          }}
        />
        <Select
          className="max-w-sm"
          defaultSelectedKeys={chartType ? [chartType] : undefined}
          label="图表类型"
          onChange={(e) => {
            setQueryState((state) => {
              return {
                ...state,
                chartType: e.target.value
                  ? statisticsSchema.shape.chartType.parse(e.target.value)
                  : null,
              };
            });
          }}
        >
          {chartTypes.map((chart) => (
            <SelectItem key={chart.key}>{chart.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4">
        {chartType === "bar" ? (
          <>
            <LineChart data={userBooking} label="用户预定情况" />
            <LineChart data={meetingRoomUsed} label="会议室使用情况" />
          </>
        ) : (
          <>
            <PieChart data={userBooking} label="用户预定情况" />
            <PieChart data={meetingRoomUsed} label="用户预定情况" />
          </>
        )}
      </div>
    </div>
  );
}
