import { z } from "zod";

export const bookingListSchema = z.object({
  skip: z.coerce.number().optional().default(0).catch(0),
  limit: z.coerce.number().optional().default(10).catch(10),
  username: z.string().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  startAt: z.coerce.date().optional().catch(undefined),
  endAt: z.coerce.date().optional().catch(undefined),
});
