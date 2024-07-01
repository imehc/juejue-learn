import { isBefore } from "date-fns";
import { z } from "zod";

export const addBookingSchema = z
  .object({
    meetingRoomId: z.coerce.number({ required_error: "请选择会议室" }),
    startAt: z.coerce.date({ required_error: "请选择开始时间" }),
    endAt: z.coerce.date({ required_error: "请选择开始时间" }),
    remark: z.string().max(50, "备注长度不能超过50位").optional(),
  })
  .refine(
    ({ startAt, endAt }) => !isBefore(endAt, startAt),
    "结束时间不能大于开始时间",
  );

export type AddBookingFormSchemaValue = z.infer<typeof addBookingSchema>;
