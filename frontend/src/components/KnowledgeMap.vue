/**
 * 文件说明：知识点脑图组件
 * 功能：
 * - 展示知识点层级结构
 * - 知识点导航
 * - 关联错题展示
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现知识点脑图
 */

<template>
  <div class="knowledge-map">
    <div class="map-header">
      <h3>知识点导航</h3>
      <el-button
        v-if="selectedNode && selectedNode.questions?.length"
        text
        @click="showQuestions = !showQuestions"
      >
        {{ showQuestions ? '隐藏错题' : '查看错题' }}
      </el-button>
    </div>

    <div class="map-container">
      <!-- 知识点树形结构 -->
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        highlight-current
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span v-if="data.questions?.length" class="question-count">
              ({{ data.questions.length }})
            </span>
          </span>
        </template>
      </el-tree>

      <!-- 关联错题展示 -->
      <el-drawer
        v-model="showQuestions"
        title="相关错题"
        direction="rtl"
        size="50%"
      >
        <div v-if="selectedNode?.questions?.length" class="questions-container">
          <el-card
            v-for="question in selectedNode.questions"
            :key="question._id"
            class="question-card"
          >
            <div class="question-content">
              <div class="text-content">{{ question.content }}</div>
              <div v-if="question.images?.length" class="image-list">
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
            </div>
          </el-card>
        </div>
        <div v-else class="empty-questions">
          暂无相关错题
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuestionStore } from '../stores/question'

const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
})

const questionStore = useQuestionStore()
const treeRef = ref(null)
const showQuestions = ref(false)
const selectedNode = ref(null)

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 构建树形数据
const treeData = computed(() => {
  const tree = {}
  
  props.questions.forEach(question => {
    question.knowledgePoints?.forEach(point => {
      const { level1, level2, level3 } = point
      
      // 构建一级节点
      if (!tree[level1]) {
        tree[level1] = {
          label: level1,
          children: {},
          questions: []
        }
      }
      tree[level1].questions.push(question)
      
      // 构建二级节点
      if (level2) {
        if (!tree[level1].children[level2]) {
          tree[level1].children[level2] = {
            label: level2,
            children: {},
            questions: []
          }
        }
        tree[level1].children[level2].questions.push(question)
        
        // 构建三级节点
        if (level3) {
          if (!tree[level1].children[level2].children[level3]) {
            tree[level1].children[level2].children[level3] = {
              label: level3,
              questions: []
            }
          }
          tree[level1].children[level2].children[level3].questions.push(question)
        }
      }
    })
  })
  
  // 转换为树形结构数组
  return Object.entries(tree).map(([key, value]) => ({
    label: key,
    questions: value.questions,
    children: Object.entries(value.children).map(([key2, value2]) => ({
      label: key2,
      questions: value2.questions,
      children: Object.entries(value2.children).map(([key3, value3]) => ({
        label: key3,
        questions: value3.questions
      }))
    }))
  }))
})

const handleNodeClick = (data) => {
  selectedNode.value = data
  if (data.questions?.length) {
    showQuestions.value = true
  }
}
</script>

<style scoped>
.knowledge-map {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.map-container {
  min-height: 400px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-count {
  font-size: 12px;
  color: #909399;
}

.questions-container {
  padding: 20px;
}

.question-card {
  margin-bottom: 16px;
}

.question-content {
  white-space: pre-wrap;
}

.image-list {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.question-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.analysis {
  margin-top: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.analysis-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.empty-questions {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
</style> 