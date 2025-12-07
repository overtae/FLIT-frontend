import z from "zod";

export const revenueSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  nicknameId: z.string(),
  phone: z.string(),
  address: z.string(),
  revenueAmount: z.number(),
  revenueCount: z.number(),
  cancelAmount: z.number(),
  cancelCount: z.number(),
  refundAmount: z.number(),
  refundCount: z.number(),
});
