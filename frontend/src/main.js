/**
 * 文件说明：前端应用主入口文件
 * 功能：
 * - 初始化Vue应用
 * - 配置全局插件（Element Plus、Router、Pinia）
 * - 挂载应用实例
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，完成基础配置
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app') 