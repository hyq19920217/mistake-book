/**
 * 文件说明：OCR服务
 * 功能：
 * - 百度OCR API封装
 * - 文字识别处理
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现OCR服务
 */

const AipOcrClient = require('baidu-aip-sdk').ocr
const fs = require('fs')

class BaiduOCR {
  constructor() {
    this.client = new AipOcrClient(
      process.env.BAIDU_OCR_APP_ID,
      process.env.BAIDU_OCR_API_KEY,
      process.env.BAIDU_OCR_SECRET_KEY
    )
  }

  async recognize(imagePath) {
    const image = fs.readFileSync(imagePath)
    const base64Img = image.toString('base64')
    
    try {
      const result = await this.client.generalBasic(base64Img)
      if (result.error_code) {
        throw new Error(result.error_msg)
      }
      
      // 提取文字内容
      const text = result.words_result
        .map(item => item.words)
        .join('\n')
      
      return { text }
    } catch (error) {
      console.error('OCR识别错误:', error)
      throw error
    }
  }
}

exports.BaiduOCR = new BaiduOCR() 