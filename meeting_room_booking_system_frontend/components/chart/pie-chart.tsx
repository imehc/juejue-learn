"use client";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";

import type { StatisticCountVo } from "~/meeting-room-booking-api";

interface Props {
  data: StatisticCountVo[];
  label: string;
}

export function PieChart({ data, label }: Props) {
  const dataMemo = useMemo(() => {
    return data.map((item) => ({
      id: item.name,
      value: item.count,
    }));
  }, [data.map]);

  return (
    <div className="flex flex-col overflow-hidden">
      <h1 className="mt-4 text-lg font-bold">{label}</h1>
      <ResponsivePie
        animate
        activeOuterRadiusOffset={8}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        arcLinkLabelsColor={{ from: "color" }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        borderWidth={1}
        cornerRadius={3}
        data={dataMemo}
        innerRadius={0.5}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        padAngle={0.7}
      />
    </div>
  );
}
