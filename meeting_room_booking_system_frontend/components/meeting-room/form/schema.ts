import { z } from "zod";
import { zfd } from "zod-form-data";

export const meetingRoomFormSchema = zfd.formData({
  id: zfd.numeric(z.coerce.number().optional().catch(undefined)),
  name: zfd.text(
    z
      .string({ required_error: "请输入会议室名称" })
      .min(1, "请输入会议室名称")
      .max(50, "名称不能超过50位"),
  ),
  capacity: zfd.numeric(
    z.coerce
      .number({ invalid_type_error: "请输入会议室容纳人数" })
      .min(1, "请输入会议室容纳人数")
      .max(50, "容纳人数不能超过50"),
  ),
  location: zfd.text(
    z
      .string({ required_error: "请输入会议室地址" })
      .min(1, "请输入会议室地址")
      .max(50, "地址不能超过50位"),
  ),
  equipment: zfd.text(z.string().max(50, "设备名称不能超过50位").optional()),
  description: zfd.text(z.string().max(50, "描述不能超过100位").optional()),
});

export type MeetingRoomFormSchemaValue = z.infer<typeof meetingRoomFormSchema>;
