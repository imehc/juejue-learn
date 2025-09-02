"use server";

import { revalidatePath } from "next/cache";
import { apiInstance } from "~/helper/auth";
import { actionClient } from "~/helper/safe-action";
import { z } from "~/helper/zod";
import { BookingApi } from "~/meeting-room-booking-api";

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
