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
  
  // 新增分類欄位
  stage: z.enum(['larva', 'adult'], { required_error: '請選擇成蟲或幼蟲' }),
  larvaStage: z.enum(['L1', 'L2', 'L3']).optional(),
  gender: z.enum(['male', 'female']).optional(),
  category: z.enum(['rhinoceros', 'stag'], { required_error: '請選擇兜蟲或鍬形蟲' }),
}).refine((data) => {
  // 如果是幼蟲，必須選擇幼蟲階段
  if (data.stage === 'larva' && !data.larvaStage) {
    return false
  }
  // 如果是成蟲，必須選擇性別
  if (data.stage === 'adult' && !data.gender) {
    return false
  }
  return true
}, {
  message: '幼蟲必須選擇階段，成蟲必須選擇性別',
  path: ['stage']
})

export const publicBeetleQuerySchema = z.object({
  q: z.string().optional(),
  species: z.string().optional(),
  forSale: z.enum(['true', 'false']).optional(),
  sort: z.enum(['createdAt_desc', 'createdAt_asc', 'species_asc']).default('createdAt_desc'),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  
  // 新增篩選條件
  stage: z.enum(['larva', 'adult']).optional(),
  larvaStage: z.enum(['L1', 'L2', 'L3']).optional(),
  gender: z.enum(['male', 'female']).optional(),
  category: z.enum(['rhinoceros', 'stag']).optional(),
  emergedFrom: z.string().optional(), // 羽化日期範圍開始
  emergedTo: z.string().optional(),   // 羽化日期範圍結束
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type BeetleInput = z.infer<typeof beetleSchema>
export type PublicBeetleQuery = z.infer<typeof publicBeetleQuerySchema>
