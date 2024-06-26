"use server";

import { revalidatePath } from "next/cache";

import { apiInstance } from "@/helper/auth";
import { Booking, BookingApi, MeetingRoom } from "@/meeting-room-booking-api";

export async function passBooking({ id }: Pick<Booking, "id">) {
  const bookingApi = apiInstance(BookingApi);

  try {
    const text = await bookingApi.passBooking({
      bookingId: id,
    });

    revalidatePath("/system/booking");

    return { data: text };
  } catch (error) {
    return { data: "fail" };
  }
}

export async function rejectBooking({ id }: Pick<MeetingRoom, "id">) {
  const bookingApi = apiInstance(BookingApi);

  try {
    const text = await bookingApi.rejectBooking({
      bookingId: id,
    });

    revalidatePath("/system/booking");

    return { data: text };
  } catch (error) {
    return { data: "fail" };
  }
}

export async function unbindBooking({ id }: Pick<MeetingRoom, "id">) {
  const bookingApi = apiInstance(BookingApi);

  try {
    const text = await bookingApi.unbindBooking({
      bookingId: id,
    });

    revalidatePath("/system/booking");

    return { data: text };
  } catch (error) {
    return { data: "fail" };
  }
}
