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
import router from './router'
import App from './App.vue'

const app = createApp(App)

// 注册全局插件
app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.mount('#app') 