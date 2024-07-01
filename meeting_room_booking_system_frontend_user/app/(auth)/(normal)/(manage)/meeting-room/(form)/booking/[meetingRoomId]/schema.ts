import { z } from "zod";

export const addBookingSchema = z.object({
  meetingRoomId: z.coerce.number({ required_error: "请选择会议室" }),
  startAt: z.coerce.date({ required_error: "请选择开始时间" }),
  endAt: z.coerce.date({ required_error: "请选择开始时间" }),
  remark: z.string().max(50, "备注长度不能超过50位").optional(),
});

export type AddBookingFormSchemaValue = z.infer<typeof addBookingSchema>;
