import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件'),
  password: z.string().min(8, '密碼至少需要 8 個字元'),
  name: z.string().min(1, '請輸入姓名').optional(),
})

export const signInSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件'),
  password: z.string().min(1, '請輸入密碼'),
})

export const beetleSchema = z.object({
  species: z.string().min(1, '請輸入品種名稱'),
  lineage: z.string().max(120, '血統描述不能超過 120 個字元').optional(),
  emergedAt: z.string().optional().or(z.coerce.date().optional()),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  isPublished: z.boolean().default(false),
  isForSale: z.boolean().default(false),
  price: z.number().int().min(0, '價格不能為負數').optional(),
})

export const publicBeetleQuerySchema = z.object({
  q: z.string().optional(),
  species: z.string().optional(),
  forSale: z.enum(['true', 'false']).optional(),
  sort: z.enum(['createdAt_desc', 'createdAt_asc', 'species_asc']).default('createdAt_desc'),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type BeetleInput = z.infer<typeof beetleSchema>
export type PublicBeetleQuery = z.infer<typeof publicBeetleQuerySchema>
