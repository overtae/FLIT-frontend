import z from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickname: z.string(),
  nicknameId: z.string(),
  phone: z.string(),
  address: z.string(),
  productName: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
});
