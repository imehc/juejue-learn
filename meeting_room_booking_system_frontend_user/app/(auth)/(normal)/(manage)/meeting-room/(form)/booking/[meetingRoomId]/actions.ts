"use server";

import { revalidatePath } from "next/cache";

import { addBookingSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { BookingApi, ResponseError } from "@/meeting-room-booking-api";

interface State {
  message?: {
    startAt?: string;
    endAt?: string;
    remark?: string;
  } | null;
  error?: string;
  success?: string;
}

export async function addBookingAction(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const payload = addBookingSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!payload.success) {
    const meetingRoomIdErr = payload.error.errors.find(
      (err) => err.path[0] === "meetingRoomId",
    )?.message;

    if (meetingRoomIdErr) {
      return { error: "未获取到会议室" };
    }

    const startAtErr = payload.error.errors.find(
      (err) => err.path[0] === "startAt",
    )?.message;
    const endAtErr = payload.error.errors.find(
      (err) => err.path[0] === "endAt",
    )?.message;
    const remarkErr = payload.error.errors.find(
      (err) => err.path[0] === "remark",
    )?.message;

    return {
      message: {
        startAt: startAtErr,
        endAt: endAtErr ?? payload.error.errors?.[0]?.message,
        remark: remarkErr,
      },
    };
  }

  try {
    const bookingApi = apiInstance(BookingApi);

    const text = await bookingApi.createBooking({
      createBookingDto: payload.data,
    });

    revalidatePath("/meeting-room");

    return {
      success: text ?? "会议室预定成功",
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      const text = await error.response.text();

      return {
        error: text ?? "会议室预定失败",
      };
    }

    return {
      error: (error as Error)?.message || "会议室预定失败",
    };
  }
}
