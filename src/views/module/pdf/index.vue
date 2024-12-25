<template>
  <div class="zhjxMain">
    <div class="content">
      <!-- 展示容器 -->
      <div class="left-box">
        <div class="left-box-up" :ref="refs.wrapper" @wheel.capture.prevent="scaleWheel($event)">
          <div class="box" :ref="refs.box" @mousedown="dragstart($event)">
            <!-- <vue-pdf-embed :ref="refs.box" :source="pdfSource" :style="scaleFun" class="vue-pdf-embed" :page="activePage" />-->
             <!-- 显示预览的图片 -->
            <img v-if="imageUrl" :src="imageUrl" :style="scaleFun" class="preview-image" />
            <el-upload
              action=""
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-change="handleFileChange"
              accept=".png, .jpg, .jpeg, .doc, .docx, .pdf, .ppt, .xls, .xlsx"
            >
              <div class="upload-content">
                <img src="../../../assets/icons/pe-upload-2.svg" class="upload-icon" />
                <div class="upload-message">
                  <p>点击上传文件 / 拖拽文件到此处 / 截图后Ctrl+V</p>
                  <p class="custom-message">
                    支持 png, jpg, jpeg, doc, docx, pdf, ppt, xlsx, xls 等格式，<br />
                    上传单个文件大小不超过 50M
                  </p>
                </div>
              </div>
            </el-upload>
          </div>
          <!-- <input type="file" @change="onFileChange" /> -->
        </div>
        <div class="left-box-down">
          <div class="zoomin-wrapper">
            <img src="../../../assets/icons/pe-bigger.svg" @click="rollBtn('enlarge')" alt="" />
            <img src="../../../assets/icons/pe-smaller.svg" @click="rollBtn('zoomin')" alt="" />
            <img src="../../../assets/icons/pe-inverse.svg" alt="" @click="rolate" />
          </div>
          <!-- 实现分页 -->
          <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalItems"
            :small="false"
            layout="prev, pager, next, jumper"
          />
        </div>
          
        </div>
      </div>
      <div class="right-box">
        <div 
          class="item" 
          v-for="(entry, value) in displayedItems" 
          :key="key"
          :style="{ display: Object.keys(displayedItems).length ? 'flex' : 'none' }"
        >
          <div class="label">{{ entry.key }}</div>
          <div class="text">
            <input v-model="entry.value" /> 
          </div>
        </div>
        <div class="upload-alert">
          <img src="../../../assets/icons//pe-empty.svg" class="upload-alert-icon" />
          <div class="upload-alert-message">
            <p class="custom-message">请上传文件</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
//导入axios封装包
import Yu from "../../../utils/axios";

//默认的图片
const imageUrl = ref(null); // 存储图片的 URL
import { ElMessage } from "element-plus";

const props = defineProps<{
  activePage: number;
}>();

const parseObj = reactive({});
const displayedItems = reactive([]);
const currentPage = 1  // 当前页
const pageSize = 1   // 每页条数
const totalItems = 8  // 总条数
const imageList = []


// 实现pdf缩放
const scaleFun = computed(() => {
  return `transform:scale(${scaleData.scale});transition: all 0.3s;`;
});
const refs = {
  wrapper: ref<HTMLElement | null>(null), // pdf外层容器
  box: ref<HTMLElement | null>(null), // pdf容器，用于拖拽
};
const dragData = reactive({
  x: 0, // 拖拽初始化时的x坐标
  y: 0, // 拖拽初始化时的y坐标
  left: 0, // 拖拽结束时的x偏移量
  top: 0, // 拖拽结束时的y偏移量
  firstX: 0, // 初始x坐标
  firstY: 0, // 初始y坐标
});
const scaleData = reactive({
  scale: 1, // 缩放比例
  scaleNum: 0.1, // 滚轮缩放比例
  scaleMax: 100, // 最大缩放比例
  scaleMin: 0.1, // 最小缩放比例
  scaleBtn: 0.4, // 缩放按钮缩放比例
  rotate: 0, // 旋转角度
});

watch(
  () => props.activePage,
  (v) => {
    // 重置pdf大小和位置
    scaleData.scale = 1;
    scaleData.rotate = 0;
    refs.box.value.style.left = '50%';
    refs.box.value.style.top = '50%';
    boxTransform();
  },
);

//分页功能
function handleCurrentChange(page) {
  this.currentPage = page;
  console.log(`当前页：${page}`);
  // 在这里可以根据页码请求数据
}

// box 容器也要跟着变化
const boxTransform = () => {
  refs.box.value.style.transform = `translate(-50%, -50%) rotate(${scaleData.rotate}deg) scale(${scaleData.scale})`;
};

// 旋转
const rolate = () => {
  scaleData.rotate += 90;
  boxTransform();
};

// 鼠标滚轮缩放
function scaleWheel(e: any) {
  e.preventDefault();
  const wrapper = refs.wrapper.value; // 获取容器 DOM
  if (!wrapper) return;

  const deltaY = e.deltaY; // 滚动方向和距离
  const newScrollTop = wrapper.scrollTop + deltaY; // 计算新的滚动位置

  // 防止滚动超出边界
  const maxScrollTop = wrapper.scrollHeight - wrapper.clientHeight;
  if (newScrollTop < 0) {
    wrapper.scrollTop = 0;
  } else if (newScrollTop > maxScrollTop) {
    wrapper.scrollTop = maxScrollTop;
  } else {
    wrapper.scrollTop = newScrollTop;
  }

  return false;
};

// 点击放大缩小
const rollBtn = (action: 'enlarge' | 'zoomin') => {
  if (action === 'enlarge') {
    scaleData.scale += scaleData.scaleBtn;
  } else {
    scaleData.scale -= scaleData.scaleBtn;
  }
  // 边界判断
  if (scaleData.scale >= scaleData.scaleMax) {
    scaleData.scale = scaleData.scaleMax;
    return;
  }
  if (scaleData.scale <= scaleData.scaleMin) {
    scaleData.scale = scaleData.scaleMin;
    return;
  }
  boxTransform();
};

// 拖拽（box容器拖拽）
function dragstart(e: MouseEvent) {
  refs.box.value.style.transition = 'none';
  e.preventDefault(); // 阻止默认事件
  const box = refs.box.value as HTMLElement;
  const wrapper = refs.wrapper.value as HTMLElement;
  dragData.x = e.pageX - box.offsetLeft;
  dragData.y = e.pageY - box.offsetTop;

  // 添加鼠标移动事件
  document.addEventListener('mousemove', move);
  function move(event: any) {
    // 计算元素的位置
    dragData.left = event.pageX - dragData.x;
    dragData.top = event.pageY - dragData.y;
    // 边界判断可以在这里添加 ↓

    // 设置元素的位置
    box.style.left = dragData.left + 'px';
    box.style.top = dragData.top + 'px';
  }
  // 添加鼠标抬起事件，鼠标抬起，将事件移除
  document.addEventListener('mouseup', function () {
    document.removeEventListener('mousemove', move);
  });
  // 鼠标离开父级元素，把事件移除
  document.addEventListener('mouseout', function () {
    document.removeEventListener('mousemove', move);
  });
};

// 上传处理函数
function beforeUpload(file) {
  // 检查文件类型
  if (!file.type.match(/^image\/(png|jpe?g)$|application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|pdf|vnd\.oasis\.opendocument\.text|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/)) {
    ElMessage.error("仅支持以下格式的文件：PNG, JPG, JPEG, DOC, DOCX, PDF, PPT, XLS, XLSX！");
    return false;
  }

  // 限制文件大小 (50MB)
  if (file.size > 50 * 1024 * 1024) {
    ElMessage.error("文件大小不能超过 50MB！");
    return false;
  }
  return true;
}

async function handleFileChange(file) {
  //新增筛选代码,修改上传成果两次的bug
  if (file.status !== 'ready') return;
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log(e)
    console.log(e.target)
    if (e.target?.result) {
      //如果用户已经选中了一个文件，则将所选文件预览出来，将提示用户上传文件的icon隐藏起来
      var uc = document.getElementsByClassName('upload-content');
      var ua = document.getElementsByClassName('upload-alert');
      var lbd = document.getElementsByClassName('left-box-down');
      var lbu = document.getElementsByClassName('left-box-up');
      
      uc[0].style.display = "none";
      ua[0].style.display = "none";
      lbd[0].style.display = "flex"
      lbu[0].style.backgroundColor = "#DCDFE4";
      // imageUrl.value = e.target.result;
      ElMessage.success("文件上传成功！");
    }
  };
  //用户上传文件后调用后端接口
  // 模拟后端返回的数据
  let formData = new FormData();
  formData.append('file', file.raw); // `file.raw` 是 el-upload 提供的文件对象
  try {
    // 发送 POST 请求
    const data = await Yu.post("/upload_document", formData);
    console.log('上传成功，返回转为图片的列表:', data.data.images);
    imageUrl.value = "data:image/jpeg;base64," + data.data.images["page_1"];
    //解析返回结果
    for(var key in data.data.images){
      imageList.push(data.data.images[key])
    }
  } catch (error) {
    console.error('上传出错:', error);
    // 错误处理逻辑，可以弹窗提示或者记录日志
  }

  Object.assign(parseObj, {name: "张三", age: "25"});
  fetchData();
  reader.onerror = () => {
    ElMessage.error("图片加载失败！");
  };
  reader.readAsDataURL(file.raw); // 注意是 file.raw
}

// TODO:模拟请求数据（延迟模拟后端返回）
async function fetchData() {
  setTimeout(() => {
    renderData(); // 调用逐字渲染函数
  }, 1000); // 1秒后模拟返回数据
}

// 渲染逻辑：逐字显示
async function renderData() {
  displayedItems.length = 0; // 清空显示数据
  for(var key in parseObj){
    const fullKey = key; // 当前 key 的完整文本
    const fullValue = parseObj[key]; // 当前 value 的完整文本

    const newItem = reactive({ key: "", value: "" }); // 初始化空项
    displayedItems.push(newItem);

    // 渲染 key 和 value
    newItem.key = await renderText(fullKey); // 渲染 key
    newItem.value = await renderText(fullValue); // 渲染 value
  }
}

// 辅助函数：逐字渲染文本
function renderText(text) {
  return new Promise((resolve) => {
    let index = 0;
    let currentText = "";

    const interval = setInterval(() => {
      currentText += text[index];
      index++;

      if (index >= text.length) {
        clearInterval(interval);
        resolve(currentText); // 渲染完成返回完整文本
      }
    }, 300); // 每300ms输出一个字
  });
}

</script>

<style scoped lang="scss">
.custom-message{
  color: rgb(117, 122, 133);
}
.zhjxMain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000000;
  overflow-y: auto; /* 纵向滚动 */
  overflow-x: hidden; /* 禁止横向滚动 */
  overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: #000000;
    // background-color: #F2F5FA;
    display: flex;
    overflow: hidden;
    background: linear-gradient(to bottom, #F2F5FA, #F2F5FA); /* 可选，便于调试 */
    .left-box {
        width: 50%;
        height: 90%;
      .left-box-up {
        // width: 50%;
        height: 100%;
        // background-color: #c0c0c0;
        background-color: #F2F5FA;
        position: relative;
        overflow: hidden;
        .box {
          width: 80%;
          // height: 100%;
          object-fit: contain;
          user-select: none; /* 不可选中,为了拖拽时不让文字高亮 */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          // .vue-pdf-embed {
          //   width: 100%;
          // }
          .preview-image {
            width: 100%;
          }
          .upload-content{
            display: block;
            width: 100%;
            position: relative; /* 确保子元素可以定位 */
            .upload-icon{
              position: absolute;
              left: 50%;  /* 水平居中 */
              transform: translate(-50%, -50%);
              width: 60px;
              height: 60px;
            }
            .upload-message{
              width: 100%;
              text-align: center;
              margin-top: 10%;
            }
            
          }
        }
        .center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .bottom-left {
          position: absolute;
          bottom: 20px;
          left: 20px;
        }
      }
      .left-box-down{
        width: 100%;
        height: 10%;
        display: none;
        justify-content: center; /* 水平居中 */
        align-items: center;     /* 垂直居中 */
        position: relative;      /* 确保可以在内部精确定位 */
        background-color: #f8f9fa;
        .zoomin-wrapper {
          position: absolute;
          // top: 10%;
          // right: 20px;
          transform: translateY(-50%);
          display: flex;
          flex-direction: row; /* 横向排列 */
          align-items: center;
          justify-content: center;
          img {
            margin-top: 10%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            margin: -20px 50px;
          }
        }
        .pagination{
          width: 20%;
        }
      }
    }
    .right-box {
      width: 50%;
      height: 100%;
      background-color: #ffffff;
      margin-left: 10px;
      padding: 10px 0;
      overflow-y: scroll;
      // 修改滚动条
      &::-webkit-scrollbar {
        width: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: #f0eded;
        border-radius: 10px;
      }
      .item {
        min-height: 48px;
        // display: flex;
        display: none;
        padding-right: 50px;
        & + .item {
          margin-top: 10px;
        }
        .label {
          width: 100px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(117, 122, 133);
          font-size: 14px;
          font-weight: 600;
          padding: 0 5px;
        }
        .text {
          flex: 1;
          color: #000000;
          background-color: #4977ea;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          line-height: 24px;
          padding: 10px 20px;
        }
      }
      .upload-alert{
        display: block;
        width: 100%;
        position: relative; /* 确保子元素可以定位 */
        .upload-alert-icon{
          position: absolute;
          left: 50%;  /* 水平居中 */
          margin-top: -40px;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
        }
        .upload-alert-message{
          width: 100%;
          text-align: center;
          margin-top: 45%;
        }
      }
    }
  }
}
</style>
