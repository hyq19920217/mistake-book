/**
 * 文件说明：首页（错题本列表）
 * 功能：
 * - 展示错题本列表
 * - 创建、编辑、删除错题本
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错题本列表功能
 */

<template>
  <div class="home-container">
    <div class="header">
      <h2>我的错题本</h2>
      <el-button type="primary" @click="showCreateDialog">
        新建错题本
      </el-button>
    </div>

    <el-row :gutter="20" class="notebook-list">
      <el-col
        v-for="notebook in notebookStore.notebooks"
        :key="notebook._id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card class="notebook-card" :body-style="{ padding: '0px' }">
          <div class="notebook-content">
            <h3>{{ notebook.name }}</h3>
            <p class="description">{{ notebook.description || '暂无描述' }}</p>
            <div class="meta">
              <span>更新时间：{{ formatDate(notebook.updatedAt) }}</span>
            </div>
          </div>
          <div class="notebook-footer">
            <el-button text @click="handleEdit(notebook)">编辑</el-button>
            <el-button text @click="handleView(notebook)">查看</el-button>
            <el-button
              text
              type="danger"
              @click="handleDelete(notebook)"
            >删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑错题本' : '新建错题本'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入错题本名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入错题本描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotebookStore } from '../stores/notebook'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const notebookStore = useNotebookStore()
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentNotebook = ref(null)
const formRef = ref(null)

const form = ref({
  name: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入错题本名称', trigger: 'blur' },
    { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ]
}

onMounted(async () => {
  try {
    await notebookStore.fetchNotebooks()
  } catch (error) {
    ElMessage.error('获取错题本列表失败')
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showCreateDialog = () => {
  isEdit.value = false
  currentNotebook.value = null
  form.value = {
    name: '',
    description: ''
  }
  dialogVisible.value = true
}

const handleEdit = (notebook) => {
  isEdit.value = true
  currentNotebook.value = notebook
  form.value = {
    name: notebook.name,
    description: notebook.description
  }
  dialogVisible.value = true
}

const handleView = (notebook) => {
  notebookStore.setCurrentNotebook(notebook)
  router.push(`/notebook/${notebook._id}`)
}

const handleDelete = async (notebook) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个错题本吗？此操作不可恢复。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await notebookStore.deleteNotebook(notebook._id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (isEdit.value) {
      await notebookStore.updateNotebook(currentNotebook.value._id, form.value)
      ElMessage.success('更新成功')
    } else {
      await notebookStore.createNotebook(form.value)
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error(error)
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notebook-list {
  margin-top: 20px;
}

.notebook-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.notebook-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.notebook-content {
  padding: 20px;
}

.notebook-content h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.description {
  margin: 10px 0;
  font-size: 14px;
  color: #606266;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta {
  font-size: 12px;
  color: #909399;
}

.notebook-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
}
</style> 