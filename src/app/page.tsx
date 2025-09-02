import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-beetle-800 mb-6">
          BeetleVault
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          甲蟲庫 - 你的專屬甲蟲紀錄與展示平台
        </p>
        <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
          建立個人甲蟲收藏紀錄，管理品種、血統、羽化日期等詳細資訊。
          一鍵上架展示你的珍貴收藏，與其他玩家分享交流。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/sign-up" className="btn-primary text-lg px-8 py-3">
            立即註冊
          </Link>
          <Link href="/browse" className="btn-secondary text-lg px-8 py-3">
            瀏覽收藏
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card p-6">
            <div className="text-beetle-600 text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">詳細紀錄</h3>
            <p className="text-gray-600">
              記錄品種、血統、羽化日期、備註等完整資訊，建立你的甲蟲資料庫。
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-beetle-600 text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">照片管理</h3>
            <p className="text-gray-600">
              上傳甲蟲照片，建立視覺化的收藏展示，讓每隻甲蟲都有專屬檔案。
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-beetle-600 text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">一鍵上架</h3>
            <p className="text-gray-600">
              輕鬆切換上架狀態，與其他玩家分享你的收藏，建立交流社群。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
