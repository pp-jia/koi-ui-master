<template>
  <div style="margin-bottom: 1px; display: flex;margin-top: 5px;">
    <el-upload :showfile-list="false" :on-change="uploadFileChange">
      <el-button type="primary" :icon="UploadFilled">上传</el-button>
    </el-upload>
    <el-button type="primary" plain @click="newProjectDialog = true" style="margin-left: 10px;">
      <el-icon><Plus /></el-icon>
      <span>新建项目</span>
    </el-button>
  </div>

  <el-dialog v-model="newProjectDialog" title="新建项目" width="50%" >
    <div class="dialog-content">
        
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="newProjectDialog = false">取消</el-button>
        <el-button type="primary" @click="newProjectDialog = false"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <div style="margin-bottom: 0px; ">
    <el-input placeholder="请输入关键字" clearable="true" style="width: 100%; height: 3.5vh" :suffix-icon="Search" v-model="searchKeyword" @keyup.enter="KeyWordSearch"/>

    <!-- <div style="float: right">
      <el-button type="primary" style="height: 3.5vh"  @click="clearSearch"
        >清除</el-button
      >
    </div> -->
  </div>

  <!-- 文件夹路径导航和返回按钮 -->
  <div class="breadcrumb-container">
    <!-- Home 图标 -->
    <div class="breadcrumb">
      <span class="home-icon" @click="navigateTo(0)">🏠</span>
      <!-- 折叠导航路径 -->
      <span v-if="currentPath.length > 2">
        <span @click="navigateTo(0)">{{ currentPath[0].name }}</span>
        <span> / </span>
        <span @click="toggleExpand">...</span>
        <span v-if="isExpanded">
          <span v-for="(folder, index) in currentPath.slice(1)" :key="folder.id">
            <span @click="navigateTo(index + 1)"> / {{ folder.name }}</span>
          </span>
        </span>
      </span>
      <span v-else>
        <span v-for="(folder, index) in currentPath" :key="folder.id">
          <span @click="navigateTo(index)">{{ folder.name }}</span>
          <span v-if="index < currentPath.length - 1"> > </span>
        </span>
      </span>
    </div>

    <!-- 返回上一级按钮 -->
    <button v-if="currentPath.length > 0" class="back-button" @click="goBack">回退</button>
  </div>

  <!-- 当前文件夹内容 -->
  <ul>
    <li
      v-for="item in currentFolder.children"
      :key="item.id"
      @click="handleItemClick(item)"
      @mouseover="hoverItem = item.id"
      @mouseleave="hoverItem = null"
      :class="{ hovered: hoverItem === item.id }"
    >
      <span v-if="item.type === 'folder'">📁{{ item.name }}</span>
      <div v-else style="display: flex; align-items: center; justify-content: center; height: 5vh; width: 100%">
        <div>
          <el-image
            style="height: 5vh; margin-top: 2px; margin-left: 5px"
            :src="item.type === 'word' ? url : url2"
          />
        </div>
        <div>
          <div style="font-size: small; margin-bottom: 1vh; margin-left: 10px">{{ item.name }}</div>
          <div style="font-size: 10px; margin-top: 1vh; margin-left: 10px">2024/12/25</div>
        </div>
        <div style="margin-left: auto; display: flex; align-items: center;">
          <div class="action-icon-extraction" @click.stop="clickToextraction(item)">
            <el-button type="primary" plain size="small">抽取</el-button>
          </div>       
          <div class="action-icon" @click.stop="handleActionClick(item)">
            <el-button type="info" plain >&nbsp;<el-icon><Delete /></el-icon>&nbsp;</el-button>
          </div>
        </div>
        
      </div>
      <span class="action-icon" @click.stop="handleActionClick(item)" title="操作" v-if="item.type === 'folder'">
        <el-icon><Tools /></el-icon>
      </span>
    </li>
    <!-- 空文件夹提示 -->
    <p v-if="currentFolder.children.length === 0" class="empty-folder">当前文件夹为空</p>
  </ul>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { Search, UploadFilled, Plus } from "@element-plus/icons-vue";
import Yu from "../../../utils/axios";
import { ElMessage, ElMessageBox } from "element-plus";
// 文件夹数据
const folders = reactive([
  {
    id: 1,
    name: "",
    children: [
      {
        id: 2,
        name: "Sub Folder 1",
        type: "folder",
        children: [
          { id: 3, name: "File 1-1", type: "file" },
          // { id: 4, name: "Sub Folder 1-1", type: "folder", children: [] }
          { id: 14, name: "File 1-2", type: "word" },
          { id: 15, name: "File 1-3", type: "word" },
        ]
      },
      {
        id: 5,
        name: "Sub Folder 2",
        type: "folder",
        children: [
          { id: 6, name: "File 2-1", type: "excel" },
          { id: 7, name: "File 2-2", type: "word" },
          { id: 8, name: "File 2-3", type: "excel" },
          { id: 9, name: "File 2-4", type: "word" },
          { id: 10, name: "File 2-5", type: "excel" },

        ]
      }
    ]
  }
]);
const url1 = ref("");
const url = ref("");
const url2 = ref("");
// 新建项目dialog指示
const newProjectDialog = ref(false);
// 关键词搜索
const searchKeyword = ref("");

// 当前路径，用于记录导航的文件夹层级
const currentPath = reactive([folders[0]]); // 初始化为根目录

// 当前显示的文件夹
const currentFolder = computed(() => {
  return currentPath.length ? currentPath[currentPath.length - 1] : folders[0];
});

// 当前悬浮的文件或文件夹
const hoverItem = ref(null);

// 是否展开完整路径
const isExpanded = ref(false);

// 点击文件或文件夹
function handleItemClick(item) {
  if (item.type === "folder") {
    currentPath.push(item); // 进入子文件夹
  } else {
    alert(`文件点击：${item.name}`);
  }
}

// 导航到某个层级
function navigateTo(index) {
  if (index === 0) {
    currentPath.splice(1); // 保留根目录
  } else {
    currentPath.splice(index + 1); // 截断路径以回到指定层级
  }
  isExpanded.value = false; // 收起路径
}

// 返回上一级
function goBack() {
  if (currentPath.length > 1) {
    currentPath.pop(); // 移除路径中的最后一个文件夹
    isExpanded.value = false; // 收起路径
  }
}

// 切换路径展开状态
function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

// 点击删除图标的处理函数
function handleActionClick(item) {
  ElMessageBox.confirm(
    `确定要删除 ${item.type === "folder" ? "文件夹及其所有内容" : "文件"} "${item.name}" 吗？`,
    "删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      const parentChildren = currentFolder.value.children; // 获取当前文件夹的 children
      // 调用删除逻辑
      if (item.type === "folder") {
        deleteFolder(item, parentChildren);
      } else {
        deleteFile(item, parentChildren);
      }
      ElMessage.success("删除成功");
    })
    .catch((error) => {
      console.log(error);
      ElMessage.info("已取消删除");
    });
}

function clickToextraction(item) {
  ElMessage.error("点击进行信息抽取")
}

// 递归删除文件夹
function deleteFolder(folder, children) {
  if (!Array.isArray(children)) {
    console.error("传入的 children 不是数组或未定义");
    return;
  }
  const index = children.findIndex((child) => child.id === folder.id);
  if (index !== -1) {
    children.splice(index, 1); // 删除当前文件夹
    console.log(`Deleted folder: ${folder.name}`);
  } else {
    console.error("Folder not found in children");
  }
}

// 删除单个文件
function deleteFile(file, children) {
  if (!Array.isArray(children)) {
    console.error("传入的 children 不是数组或未定义");
    return;
  }
  const index = children.findIndex((child) => child.id === file.id);
  if (index !== -1) {
    children.splice(index, 1); // 从当前层级移除该文件
  } else {
    console.error("File not found in children");
  }
}


//单个上传文件，上传功能、以及上传成功后将返回的信息加入至当前路径下的数组之中
async function uploadFileChange(file) {
  if (file.status !== "ready") return;
  if (currentPath.length !== 2) {
    ElMessage.error({message:"请在用户项目的文件夹中上传您所需要检测的文件！",duration:5000});
    return;
  }

  try {
    //用户上传文件后调用后端接口
    //模拟后端返回的数据
    let formData = new FormData();
    formData.append("file", file.raw); // `file.raw` 是 el-upload 提供的文件对象

    const data = await Yu.post("/upload_document", formData);
    if (data.status == 200) {
      const parentChildren = currentFolder.value.children;
      parentChildren.push({
        id: 9,
        name: "临时测试文件",
        type: "word",
      });
      ElMessage.success("上传成功");
    } else {
      ElMessage.error("上传失败");
    }
  } catch (error) {
    console.error("上传出错:", error);
  }
}

//处理keyword的搜索
async function KeyWordSearch() {
  if (searchKeyword.value === "") {
    searchKeyword.value = null;
  }
  ElMessage.success("点击进搜索")
}

async function inputChange() {
  ElMessage.success(`点击进搜索${searchKeyword.value}`)
}
</script>

<style scoped>
.breadcrumb-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 10px;
  min-height: 32px; /* 占位效果，避免内容跳动 */
}
.breadcrumb {
  display: flex;
  align-items: center;
}
.breadcrumb .home-icon {
  margin-right: 8px;
  cursor: pointer;
  font-size: 18px;
}
.breadcrumb span {
  cursor: pointer;
  color: #606266;
}
.breadcrumb span:hover {
  text-decoration: underline;
}
.back-button {
  padding: 4px 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.back-button:hover {
  background-color: #0056b3;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  cursor: pointer;
  padding: 8px 0;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
li.hovered {
  background-color: var(--el-color-primary-light-9); /* 浅蓝色高亮效果 */
}

/* 新增样式用于调整齿轮图标的显示 */
.action-icon {
  margin-left: auto;
  margin-right: 8px;
  cursor: pointer;
  color: #606266;
  font-size: 16px;
}

.action-icon-extraction {
  cursor: pointer;
  margin-right: 7px;
  color: #606266;
  font-size: 16px;
}

.empty-folder {
  color: gray;
  font-style: italic;
  margin-top: 8px;
}

/* dialog样式 */
</style>
