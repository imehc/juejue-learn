"use server";

import { revalidatePath } from "next/cache";
import { flattenValidationErrors } from "next-safe-action";

import { addBookingSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { BookingApi } from "@/meeting-room-booking-api";
import { actionClient } from "@/helper/safe-action";

export const addBookingAction = actionClient
  .schema(addBookingSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .stateAction<{
    message?: string;
  }>(async ({ parsedInput }, {}) => {
    const bookingApi = await apiInstance(BookingApi);

    const text = await bookingApi.createBooking({
      createBookingDto: parsedInput,
    });

    revalidatePath("/meeting-room");

    return {
      message: text ?? "会议室预定成功",
    };
  });
