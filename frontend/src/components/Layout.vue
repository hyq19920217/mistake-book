/**
 * 文件说明：主布局组件
 * 功能：
 * - 页面整体布局
 * - 导航栏
 * - 用户菜单
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现基础布局
 */

<template>
  <el-container class="layout-container">
    <el-header>
      <div class="header-content">
        <div class="logo">错题本</div>
        <div class="user-menu" v-if="userStore.isAuthenticated">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ userStore.username }}
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style> 