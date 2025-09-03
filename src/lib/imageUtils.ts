// 圖片壓縮和優化工具
export function compressBase64Image(base64: string, quality: number = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // 計算壓縮後的尺寸
      const maxWidth = 400
      const maxHeight = 300
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // 繪製壓縮後的圖片
      ctx?.drawImage(img, 0, 0, width, height)
      
      // 轉換為壓縮的 base64
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    
    img.src = base64
  })
}

// 檢查圖片大小
export function getImageSize(base64: string): number {
  // 移除 data:image/...;base64, 前綴
  const base64Data = base64.split(',')[1]
  // Base64 編碼會增加約 33% 的大小
  return Math.round((base64Data.length * 3) / 4)
}

// 格式化檔案大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
