"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { apiInstance } from "@/helper/auth";
import { BookingApi } from "@/meeting-room-booking-api";
import { actionClient } from "@/helper/safe-action";

const schema = z.object({
  id: z.coerce.number({ required_error: "未预定会议室" }),
});

export const passBookingAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const bookingApi = apiInstance(BookingApi);
    const text = await bookingApi.passBooking({
      bookingId: id,
    });

    revalidatePath("/system/booking");

    return { message: text ?? "通过申请成功" };
  });

export const rejectBookingAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const bookingApi = apiInstance(BookingApi);
    const text = await bookingApi.rejectBooking({
      bookingId: id,
    });

    revalidatePath("/system/booking");

    return { message: text ?? "驳回申请成功" };
  });

export const unbindBookingAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const bookingApi = apiInstance(BookingApi);
    const text = await bookingApi.unbindBooking({
      bookingId: id,
    });

    revalidatePath("/system/booking");

    return { message: text ?? "解除申请成功" };
  });

export type PassBookingAction = typeof passBookingAction;
export type RejectBookingAction = typeof rejectBookingAction;
export type UnbindBookingAction = typeof unbindBookingAction;
