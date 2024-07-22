"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { flattenValidationErrors } from "next-safe-action";

import { apiInstance } from "@/helper/auth";
import { BookingApi, MeetingRoom } from "@/meeting-room-booking-api";
import { actionClient } from "@/helper/safe-action";

const unbindBookingschema = z.object({
  id: z.coerce.number({ invalid_type_error: "id不合法" }),
});

export const unbindBookingAction = actionClient
  .schema(unbindBookingschema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const bookingApi = apiInstance(BookingApi);

    const text = await bookingApi.unbindBooking({
      bookingId: id,
    });

    revalidatePath("/booking-history");

    return { message: text ?? "解除预定成功" };
  });

export async function unbindBooking({ id }: Pick<MeetingRoom, "id">) {
  const bookingApi = apiInstance(BookingApi);

  try {
    const text = await bookingApi.unbindBooking({
      bookingId: id,
    });

    revalidatePath("/booking-history");

    return { data: text };
  } catch (error) {
    return { data: "fail" };
  }
}
