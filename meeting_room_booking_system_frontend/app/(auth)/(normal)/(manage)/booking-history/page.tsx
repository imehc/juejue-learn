import { unbindBooking } from "./actions";

import { BookingList, bookingListSchema } from "@/components/booking";
import { UnknownError } from "@/components/unknown-error";
import { apiInstance } from "@/helper/auth";
import { BookingApi, UserApi } from "@/meeting-room-booking-api";

export default async function BookingHistoryPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const payload = bookingListSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError />;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { username: _, ...attr } = payload.data;

  const userApi = apiInstance(UserApi);
  const bookingApi = apiInstance(BookingApi);
  const user = await userApi.getUserInfo();

  const bookingList = await bookingApi.findAllBooking({
    ...attr,
    username: user.username,
    skip: payload.data.skip + 1,
  });

  return (
    <BookingList
      {...bookingList}
      status={payload.data.status}
      type="normal"
      unbindBooking={unbindBooking}
    />
  );
}
