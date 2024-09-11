import { Statistics } from "./statistics";
import { statisticsSchema } from "./schema";

import { apiInstance } from "@/helper/auth";
import { StatisticApi } from "@/meeting-room-booking-api";
import { UnknownError } from "@/components/unknown-error";

export default async function SystemStatistics({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const payload = statisticsSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chartType: _, ...props } = payload.data;

  const statisticApi = apiInstance(StatisticApi);
  const userBooking = await statisticApi.findUserBookingCount(props);
  const meetingRoomUsed = await statisticApi.findMeetingRoomUsedCount(props);

  return (
    <Statistics meetingRoomUsed={meetingRoomUsed} userBooking={userBooking} />
  );
}
