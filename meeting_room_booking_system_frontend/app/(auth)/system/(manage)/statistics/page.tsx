import { UnknownError } from "~/components/unknown-error";
import { apiInstance } from "~/helper/auth";
import { parseZodErr } from "~/helper/parse";
import { StatisticApi } from "~/meeting-room-booking-api";
import type { BasicPageParams } from "~/types";

import { statisticsSchema } from "./schema";
import { Statistics } from "./statistics";

export default async function SystemStatistics(props: BasicPageParams) {
  const searchParams = await props.searchParams;
  const payload = statisticsSchema.safeParse(searchParams);

  if (!payload.success) {
    return <UnknownError msg={parseZodErr(payload)} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chartType: _, ...attr } = payload.data;

  const statisticApi = await apiInstance(StatisticApi);
  const userBooking = await statisticApi.findUserBookingCount(attr);
  const meetingRoomUsed = await statisticApi.findMeetingRoomUsedCount(attr);

  return (
    <Statistics meetingRoomUsed={meetingRoomUsed} userBooking={userBooking} />
  );
}
