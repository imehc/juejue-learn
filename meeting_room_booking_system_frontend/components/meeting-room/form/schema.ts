import { z } from "zod";

export const meetingRoomFormSchema = z.object({
  name: z.string().min(1, "请输入会议室名称").max(50, "名称不能超过50位"),
  capacity: z.coerce
    .number()
    .min(1, "请输入会议室容纳人数")
    .max(50, "容纳人数不能超过50"),
  location: z.string().min(1, "请输入会议室地址").max(50, "地址不能超过50位"),
  equipment: z.string().max(50, "设备名称不能超过50位").optional(),
  description: z.string().max(50, "描述不能超过100位").optional(),
});

export type MeetingRoomFormSchemaValue = z.infer<typeof meetingRoomFormSchema>;
