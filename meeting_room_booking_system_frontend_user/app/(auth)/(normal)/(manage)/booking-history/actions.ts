"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "@/helper/auth";
import { BookingApi, MeetingRoom } from "@/meeting-room-booking-api";

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
