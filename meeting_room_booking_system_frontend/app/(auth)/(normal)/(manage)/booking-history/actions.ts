"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "~/helper/auth";
import { actionClient } from "~/helper/safe-action";
import { z } from "~/helper/zod";
import { BookingApi } from "~/meeting-room-booking-api";

const unbindBookingschema = z.object({
  id: z.coerce.number({ error: "id不合法" }),
});

export const unbindBookingAction = actionClient
  .inputSchema(unbindBookingschema)
  .action(async ({ parsedInput: { id } }) => {
    const bookingApi = await apiInstance(BookingApi);

    const text = await bookingApi.unbindBooking({
      bookingId: id,
    });

    revalidatePath("/booking-history");

    return { message: text ?? "解除预定成功" };
  });

export type UnbindBookingAction = typeof unbindBookingAction;
