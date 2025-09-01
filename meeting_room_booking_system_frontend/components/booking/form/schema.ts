import { isBefore } from "date-fns";
import { zfd } from "zod-form-data";

import { z } from "~/helper/zod";

// 服务器输入定义操作
export const addBookingSchema = zfd
  .formData({
    meetingRoomId: zfd.numeric(z.coerce.number({ error: "未获取到会议室" })),
    startAt: zfd.text(z.coerce.date({ error: "请选择开始时间" })),
    endAt: zfd.text(z.coerce.date({ error: "请选择结束时间" })),
    remark: zfd.text(z.string().max(50, "备注长度不能超过50位").optional()),
  })
  .refine(
    ({ startAt, endAt }) => !isBefore(endAt, startAt),
    "结束时间不能小于于开始时间",
  );

export type AddBookingFormSchemaValue = z.infer<typeof addBookingSchema>;
