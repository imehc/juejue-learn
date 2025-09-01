"use server";

import { revalidatePath } from "next/cache";

import { z } from "~/helper/zod";
import { apiInstance } from "~/helper/auth";
import { BookingApi } from "~/meeting-room-booking-api";
import { actionClient } from "~/helper/safe-action";

const schema = z.object({
  bookingId: z.coerce.number(),
});

export const urgeBookingAction = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const bookingApi = await apiInstance(BookingApi);
    const text = await bookingApi.urgeBooking({ bookingId });

    revalidatePath("/meeting-room");

    return { message: text ?? "催办成功" };
  });
