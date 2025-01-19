/**
 * 文件说明：错题本详情页面
 * 功能：
 * - 错题列表展示
 * - 错题添加/编辑
 * - 图片上传和OCR
 * - 知识点分析
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错题管理功能
 */

<template>
  <div class="notebook-container">
    <div class="header">
      <div class="title">
        <el-page-header @back="goBack">
          <template #content>
            <span class="notebook-name">{{ notebookStore.currentNotebook?.name }}</span>
          </template>
        </el-page-header>
      </div>
      <div class="actions">
        <el-button type="primary" @click="showCreateDialog">
          添加错题
        </el-button>
        <el-button
          type="success"
          :loading="questionStore.analyzing"
          @click="handleAnalyze"
        >
          分析知识点
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="notebook-tabs">
      <el-tab-pane label="错题列表" name="list">
        <!-- 错题列表 -->
        <div class="question-list" v-loading="questionStore.loading">
          <el-empty v-if="!questionStore.questions.length" description="暂无错题" />
          <el-card
            v-else
            v-for="question in questionStore.questions"
            :key="question._id"
            class="question-card"
          >
            <div class="question-content">
              <div class="text-content">{{ question.content }}</div>
              <div v-if="question.images.length" class="image-list">
                <el-image
                  v-for="(image, index) in question.images"
                  :key="index"
                  :src="image.url"
                  :preview-src-list="question.images.map(img => img.url)"
                  fit="cover"
                  class="question-image"
                />
              </div>
              <div v-if="question.analysis" class="analysis">
                <div class="analysis-title">解析：</div>
                <div class="analysis-content">{{ question.analysis }}</div>
              </div>
              <div v-if="question.knowledgePoints?.length" class="knowledge-points">
                <div class="knowledge-title">知识点：</div>
                <el-tag
                  v-for="(point, index) in question.knowledgePoints"
                  :key="index"
                  class="knowledge-tag"
                  type="success"
                >
                  {{ `${point.level1} > ${point.level2} > ${point.level3}` }}
                </el-tag>
              </div>
            </div>
            <div class="question-footer">
              <el-button text @click="handleEdit(question)">编辑</el-button>
              <el-button text type="danger" @click="handleDelete(question)">删除</el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="知识点导航" name="map">
        <knowledge-map
          :questions="questionStore.questions"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑错题对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑错题' : '添加错题'"
      width="60%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="题目" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入题目内容"
          />
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            class="image-upload"
            action="/api/upload/image"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            accept="image/*"
            multiple
          >
            <el-button type="primary">上传图片</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持jpg/png格式，单个文件不超过5MB
              </div>
            </template>
          </el-upload>
          <div v-if="form.images.length" class="upload-list">
            <el-image
              v-for="(image, index) in form.images"
              :key="index"
              :src="image.url"
              fit="cover"
              class="upload-image"
            >
              <template #placeholder>
                <div class="image-slot">加载中</div>
              </template>
            </el-image>
          </div>
        </el-form-item>

        <el-form-item label="解析" prop="analysis">
          <el-input
            v-model="form.analysis"
            type="textarea"
            :rows="3"
            placeholder="请输入题目解析"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotebookStore } from '../stores/notebook'
import { useQuestionStore } from '../stores/question'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import KnowledgeMap from '../components/KnowledgeMap.vue'

const route = useRoute()
const router = useRouter()
const notebookStore = useNotebookStore()
const questionStore = useQuestionStore()
const userStore = useUserStore()

const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const activeTab = ref('list')

const form = ref({
  content: '',
  images: [],
  analysis: '',
  notebookId: route.params.id
})

const rules = {
  content: [
    { required: true, message: '请输入题目内容', trigger: 'blur' }
  ]
}

const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${userStore.token}`
}))

onMounted(async () => {
  try {
    await questionStore.fetchQuestions(route.params.id)
  } catch (error) {
    ElMessage.error('获取错题列表失败')
  }
})

const goBack = () => {
  router.push('/')
}

const showCreateDialog = () => {
  isEdit.value = false
  form.value = {
    content: '',
    images: [],
    analysis: '',
    notebookId: route.params.id
  }
  dialogVisible.value = true
}

const handleEdit = (question) => {
  isEdit.value = true
  form.value = {
    ...question,
    notebookId: route.params.id
  }
  dialogVisible.value = true
}

const handleDelete = async (question) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这道错题吗？此操作不可恢复。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await questionStore.deleteQuestion(question._id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  form.value.images.push({
    url: response.data.url,
    description: ''
  })
  if (response.data.ocrText) {
    form.value.content = form.value.content
      ? `${form.value.content}\n${response.data.ocrText}`
      : response.data.ocrText
  }
}

const handleUploadError = () => {
  ElMessage.error('图片上传失败')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (isEdit.value) {
      await questionStore.updateQuestion(form.value._id, form.value)
      ElMessage.success('更新成功')
    } else {
      await questionStore.createQuestion(form.value)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error(error)
    ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}

const handleAnalyze = async () => {
  if (!questionStore.questions.length) {
    return ElMessage.warning('暂无错题可分析')
  }

  try {
    await questionStore.analyzeKnowledgePoints(
      questionStore.questions.map(q => q._id)
    )
    ElMessage.success('知识点分析完成')
  } catch (error) {
    ElMessage.error('知识点分析失败')
  }
}
</script>

<style scoped>
.notebook-container {
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

.notebook-name {
  font-size: 20px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 12px;
}

.question-list {
  margin-top: 20px;
}

.question-card {
  margin-bottom: 20px;
}

.question-content {
  padding: 20px;
}

.text-content {
  white-space: pre-wrap;
  margin-bottom: 16px;
}

.image-list {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.question-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.analysis {
  margin-top: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.analysis-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.knowledge-points {
  margin-top: 16px;
}

.knowledge-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.knowledge-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.question-footer {
  border-top: 1px solid #EBEEF5;
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.image-upload {
  margin-bottom: 16px;
}

.upload-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.upload-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
</style> 