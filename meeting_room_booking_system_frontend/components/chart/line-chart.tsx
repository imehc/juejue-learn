"use client";
import { type BarDatum, ResponsiveBar } from "@nivo/bar";

import type { StatisticCountVo } from "~/meeting-room-booking-api";

interface Props {
  data: StatisticCountVo[];
  label: string;
}

export function LineChart({ data, label }: Props) {
  return (
    <div className="flex flex-col overflow-hidden">
      <h1 className="mt-4 text-lg font-bold">{label}</h1>
      <ResponsiveBar
        animate
        axisRight={null}
        axisTop={null}
        data={data as unknown as readonly BarDatum[]}
        enableLabel={false}
        indexBy="name"
        keys={["count"]}
        margin={{ top: 30, right: 0, bottom: 30, left: 30 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
      />
    </div>
  );
}
