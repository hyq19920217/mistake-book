/**
 * 文件说明：AI服务
 * 功能：
 * - OpenAI API封装
 * - 知识点分析
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现AI分析服务
 */

const OpenAI = require('openai')

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async analyzeKnowledgePoints(questions) {
    const prompt = `分析以下题目的知识点，将每道题目的知识点分为三级（最多三级）。
返回JSON格式，包含questionId和knowledgePoints数组。
题目内容如下：
${questions.map(q => `ID: ${q._id}\n内容: ${q.content}\n`).join('\n')}

要求：
1. 每道题的知识点层级不超过3级
2. 同类题目使用相同的知识点层级
3. 返回格式示例：
{
  "results": [
    {
      "questionId": "题目ID",
      "knowledgePoints": [
        {
          "level1": "一级知识点",
          "level2": "二级知识点",
          "level3": "三级知识点"
        }
      ]
    }
  ]
}`

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的教育专家，擅长分析题目的知识点体系。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const response = completion.choices[0].message.content
      return JSON.parse(response)
    } catch (error) {
      console.error('AI分析错误:', error)
      throw new Error('知识点分析失败')
    }
  }
}

exports.AIService = new AIService() 