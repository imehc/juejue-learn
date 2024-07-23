import { z } from "@/helper/zod";

export const userListSchema = z.object({
  skip: z.coerce.number().optional().default(0).catch(0),
  limit: z.coerce.number().optional().default(10).catch(10),
  username: z.string().optional(),
  nickName: z.string().optional(),
  email: z.string().optional(),
});
