import { z } from "zod";

import { BookingStatusEnum } from "@/meeting-room-booking-api";

export const bookingListSchema = z.object({
  skip: z.coerce.number().optional().default(0).catch(0),
  limit: z.coerce.number().optional().default(10).catch(10),
  username: z.string().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  status: z
    .enum([
      BookingStatusEnum.Apply,
      BookingStatusEnum.Pass,
      BookingStatusEnum.Reject,
      BookingStatusEnum.Unbind,
    ])
    .optional()
    .catch(undefined),
  startAt: z.coerce.date().optional().catch(undefined),
  endAt: z.coerce.date().optional().catch(undefined),
});

export type BookingListSchemaValue = z.infer<typeof bookingListSchema>;
