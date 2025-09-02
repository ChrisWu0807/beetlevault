import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('開始建立種子資料...')

  // 建立測試用戶
  const passwordHash = await bcrypt.hash('password123', 12)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@beetlevault.com' },
    update: {},
    create: {
      email: 'demo@beetlevault.com',
      passwordHash,
      name: '甲蟲玩家',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash,
      name: '測試用戶',
    },
  })

  console.log('建立用戶:', { user1: user1.email, user2: user2.email })

  // 建立甲蟲紀錄
  const beetles = [
    {
      ownerId: user1.id,
      species: '獨角仙',
      lineage: '台灣本土種',
      emergedAt: new Date('2023-06-15'),
      notes: '體型健壯，角型優美，是今年最滿意的個體。',
      isPublished: true,
      isForSale: true,
      price: 500,
    },
    {
      ownerId: user1.id,
      species: '鍬形蟲',
      lineage: '日本大鍬形蟲',
      emergedAt: new Date('2023-07-20'),
      notes: '大顎發達，體色深黑，適合繁殖。',
      isPublished: true,
      isForSale: false,
    },
    {
      ownerId: user1.id,
      species: '彩虹鍬形蟲',
      lineage: '彩虹鍬形蟲',
      emergedAt: new Date('2023-08-10'),
      notes: '體色鮮豔，是收藏中的珍品。',
      isPublished: true,
      isForSale: true,
      price: 1200,
    },
    {
      ownerId: user2.id,
      species: '長戟大兜蟲',
      lineage: '長戟大兜蟲',
      emergedAt: new Date('2023-05-30'),
      notes: '體型巨大，是兜蟲中的王者。',
      isPublished: true,
      isForSale: true,
      price: 2000,
    },
    {
      ownerId: user2.id,
      species: '姬兜蟲',
      lineage: '姬兜蟲',
      emergedAt: new Date('2023-09-05'),
      notes: '小巧可愛，適合新手飼養。',
      isPublished: false,
      isForSale: false,
    },
  ]

  for (const beetleData of beetles) {
    await prisma.beetle.upsert({
      where: {
        id: `${beetleData.species}-${beetleData.ownerId}`,
      },
      update: {},
      create: {
        ...beetleData,
        id: undefined, // 讓 Prisma 自動生成 ID
      },
    })
  }

  console.log('建立甲蟲紀錄完成')

  // 顯示統計
  const userCount = await prisma.user.count()
  const beetleCount = await prisma.beetle.count()
  const publishedCount = await prisma.beetle.count({
    where: { isPublished: true },
  })

  console.log('種子資料建立完成！')
  console.log(`用戶數量: ${userCount}`)
  console.log(`甲蟲紀錄數量: ${beetleCount}`)
  console.log(`已上架數量: ${publishedCount}`)
  console.log('')
  console.log('測試帳號:')
  console.log('Email: demo@beetlevault.com')
  console.log('Password: password123')
  console.log('')
  console.log('Email: test@example.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
