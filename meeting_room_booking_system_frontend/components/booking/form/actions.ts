"use server";

import { revalidatePath } from "next/cache";
import { flattenValidationErrors } from "next-safe-action";

import { apiInstance } from "~/helper/auth";
import { actionClient } from "~/helper/safe-action";
import { BookingApi } from "~/meeting-room-booking-api";

import { addBookingSchema } from "./schema";

export const addBookingAction = actionClient
  .inputSchema(addBookingSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction<{
    message?: string;
  }>(async ({ parsedInput }) => {
    const bookingApi = await apiInstance(BookingApi);

    const text = await bookingApi.createBooking({
      createBookingDto: parsedInput,
    });

    revalidatePath("/meeting-room");

    return {
      message: text ?? "会议室预定成功",
    };
  });
