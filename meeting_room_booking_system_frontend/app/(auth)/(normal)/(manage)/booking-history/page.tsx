import { unbindBookingAction } from "./actions";

import { BookingList, bookingListSchema } from "@/components/booking";
import { UnknownError } from "@/components/unknown-error";
import { apiInstance } from "@/helper/auth";
import { parseZodErr } from "@/helper/parse";
import {
  BookingApi,
  type BookingApiFindAllBookingRequest,
  UserApi,
} from "@/meeting-room-booking-api";
import { BasicPageParams } from "@/types";

export default async function BookingHistoryPage(props: BasicPageParams) {
  const searchParams = await props.searchParams;
  const payload = bookingListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError msg={parseZodErr(payload)} />;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { username: _, ...attr } = payload.data;

  const userApi = await apiInstance(UserApi);
  const bookingApi = await apiInstance(BookingApi);
  const user = await userApi.getUserInfo();

  const bookingList = await bookingApi.findAllBooking({
    ...(attr as BookingApiFindAllBookingRequest),
    username: user.username,
    skip: payload.data.skip + 1,
  });

  return (
    <BookingList
      {...bookingList}
      status={payload.data.status}
      type="normal"
      unbindBooking={unbindBookingAction}
    />
  );
}
