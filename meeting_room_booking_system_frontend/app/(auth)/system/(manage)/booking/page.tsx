import { BookingList, bookingListSchema } from "~/components/booking";
import { UnknownError } from "~/components/unknown-error";
import { apiInstance } from "~/helper/auth";
import { parseZodErr } from "~/helper/parse";
import {
  BookingApi,
  type BookingApiFindAllBookingRequest,
} from "~/meeting-room-booking-api";
import type { BasicPageParams } from "~/types";

import {
  passBookingAction,
  rejectBookingAction,
  unbindBookingAction,
} from "./actions";

export default async function SystemBookingPage(props: BasicPageParams) {
  const searchParams = await props.searchParams;
  const payload = bookingListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError msg={parseZodErr(payload)} />;
  }
  const bookingApi = await apiInstance(BookingApi);
  const bookingList = await bookingApi.findAllBooking({
    ...(payload.data as BookingApiFindAllBookingRequest),
    skip: payload.data.skip + 1,
  });

  return (
    <BookingList
      {...bookingList}
      passBooking={passBookingAction}
      rejectBooking={rejectBookingAction}
      status={payload.data.status}
      type="system"
      unbindBooking={unbindBookingAction}
    />
  );
}
