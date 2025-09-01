import { z } from "~/helper/zod";

export const chartTypes = [
  { key: "pie", label: "饼图" },
  { key: "bar", label: "柱状图" },
] as const;

const keys = chartTypes.map((item) => item.key) as ["pie", "bar"];

export const statisticsSchema = z.object({
  startAt: z.coerce.date().optional().catch(undefined),
  endAt: z.coerce.date().optional().catch(undefined),
  chartType: z.enum(keys).optional().catch(undefined),
});

export type StatisticsSchemaSchemaValue = z.infer<typeof statisticsSchema>;
