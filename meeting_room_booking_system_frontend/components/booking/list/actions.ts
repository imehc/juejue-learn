"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "@/helper/auth";
import { BookingApi } from "@/meeting-room-booking-api";

export async function urgeBooking(bookingId: number) {
  const bookingApi = apiInstance(BookingApi);

  revalidatePath("/meeting-room");
  try {
    const res = await bookingApi.urgeBooking({ bookingId });

    return { success: res };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message ?? "催办失败",
      };
    }

    return {
      error: "催办失败",
    };
  }
}
