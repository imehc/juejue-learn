import { z } from "zod";

export const meetingRoomListSchema = z.object({
  skip: z.coerce.number().optional().default(0).catch(0),
  limit: z.coerce.number().optional().default(10).catch(10),
  name: z.string().optional(),
  capacity: z.coerce.number().optional(),
  equipment: z.string().optional(),
});
