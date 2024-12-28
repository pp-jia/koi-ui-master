<template>
  <div class="zhjxMain">
    <div class="content">
      <!-- 展示容器 -->
      <div class="left-box">
        <div class="left-box-up" :ref="refs.wrapper" @wheel.capture.prevent="scaleWheel($event)" >
          <div class="box" :ref="refs.box" >
            <!-- 显示预览的图片 -->
            <div class="image_wrapper" v-viewer="{movable: true}" :style="scaleFun" :ref="refs.imageWrapper ">
              <div
                v-for="(imageItemUrl, index) in imageList"
                :key="index"
                class="mask"
              >
                <!-- 动态渲染 img -->
                <img 
                  v-if="imageItemUrl"
                  :src="imageItemUrl"
                  class="preview-image"
                />
              </div>
            </div>
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
        </div>
        <div class="left-box-down">
          <div class="zoomin-wrapper">
            <!-- <img src="../../../assets/icons/pe-bigger.svg" @click="rollBtn('enlarge')" alt="" />
            <img src="../../../assets/icons/pe-smaller.svg" @click="rollBtn('zoomin')" alt="" />
            <img src="../../../assets/icons/pe-inverse.svg" alt="" @click="rolate" /> -->
            <d-pagination
              size="sm"
              v-model:total="pager.total"
              v-model:pageSize="pager.pageSize"
              total-item-text="总页数"
              v-model:pageIndex="pager.pageIndex"
              :can-view-total="true"
              :canJumpPage="true"
              :can-change-page-size="false"
              :lite="false"
              @page-index-change="pageIndexChange"
            />
          </div>
        </div>
      </div>
      <div class="right-box">
        <!-- <div 
          class="item" 
          v-for="(entry, value) in displayedItems" 
          :key="key"
          :style="{ display: Object.keys(displayedItems).length ? 'flex' : 'none' }"
        >
          <div class="label">{{ entry.key }}</div>
          <div class="text">
            <input v-model="entry.value" /> 
          </div>
        </div> -->
        <div class="PeTableContainer">
          <d-table
            ref="tableRef"
            size="md"
            header-bg="true"
            border-type="bordered"
            :data="data"
            table-height="500px"
            row-key="id"
            @cellClick="cellClick"
          >
            <d-column type="checkable" width="40" :checkable="checkable" reserve-check></d-column>
            <d-column field="firstName" header="First Name" type="editable">
              <template #cell="scope">
                {{ scope.row.firstName }}
              </template>
              <template #cellEdit="scope">
                <d-input
                  ref="firstNameRef"
                  v-model="scope.row.firstName"
                  @change="(value) => change(scope.row, scope.rowIndex, 'firstName', value)"
                  @blur="() => blur(scope.row, scope.rowIndex, 'firstName')"
                />
              </template>
            </d-column>
            <d-column field="lastName" header="Last Name" type="editable">
              <template #cell="scope">
                {{ scope.row.lastName }}
              </template>
              <template #cellEdit="scope">
                <d-input
                  ref="lastNameRef"
                  v-model="scope.row.lastName"
                  @change="(value) => change(scope.row, scope.rowIndex, 'lastName', value)"
                  @blur="() => blur(scope.row, scope.rowIndex, 'lastName')"
                />
              </template>
            </d-column>
            <d-column field="gender" header="Gender" type="editable">
              <template #cell="scope">
                {{ scope.row.gender }}
              </template>
              <template #cellEdit="scope">
                <d-select
                  ref="genderRef"
                  v-model="scope.row.gender"
                  :options="options"
                  @valueChange="(value) => change(scope.row, scope.rowIndex, 'gender', value)"
                />
              </template>
            </d-column>
            <template #empty>
              <div style="text-align: center;">No Data</div>
            </template>
          </d-table>
        </div>
        <div class="upload-alert">
          <img src="../../../assets/icons//pe-empty.svg" class="upload-alert-icon"/>
          <div class="upload-alert-message">
            <p class="custom-message">请上传文件</p>
          </div>
        </div>

        <div class="fieldContainer">
          <span class="fieldLabel">文本字段:</span>
          <el-tag
            v-for="tag in fieldsAlert"
            :key="tag"
            type="primary"
            style="margin-right: 5px; " 
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">
            添加字段
          </el-button>
        </div>
        
        <div class="fieldHeadContainer">
          <span class="fieldLabel">表格表头:</span>
          <el-tag
            v-for="tag in fieldsAlert"
            :key="tag"
            type="primary"
            style="margin-right: 5px; " 
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">
            添加字段
          </el-button>
        </div>
        
        <div class="AddStoreButton">
          <el-button type="primary" icon="" @click="handleSaveClick" plain >暂存结果</el-button>
          <el-button type="primary" icon="Upload" @click="handleClick" :loading=showLoading>入库</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick} from 'vue';
//导入axios封装包
import Yu from "../../../utils/axios";
import { koiMsgError, koiMsgSuccess, koiMsgBox, koiNoticeSuccess } from '@/utils/koi';
import type { InputInstance } from 'element-plus'

//默认的图片
const imageUrl = ref(null); // 存储图片的 URL
const pager = reactive({
  total: null,
  pageIndex: null,
  pageSize: 1,
});
const props = defineProps<{
  activePage: number;
}>();
const parseObj = reactive({});
const displayedItems = reactive([]);
let isImage = true
let isAllow = true
const imageList = reactive([])
let i = 0;
let totalImages = null

// 实现缩放
const scaleFun = computed(() => {
  // 动态更新 currentMarginBottom
  if (i == 0){
    i += 1
    return `transform:scale(${scaleData.scale});transition: all 0.3s;`;
  }
  if (i == 11){
    i = 1
  }
  return `transform:scale(${scaleData.scale});transition: all 0.3s; display: flex;`;
});
const refs = {
  wrapper: ref<HTMLElement | null>(null), // pdf外层容器
  box: ref<HTMLElement | null>(null), // pdf容器，用于拖拽
  imageWrapper: ref<HTMLElement | null>(null),
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
  scaleMax: 4, // 最大缩放比例
  scaleMin: 0.1, // 最小缩放比例
  scaleBtn: 0.2, // 缩放按钮缩放比例
  rotate: 0, // 旋转角度
  // currentMarginBottom: 10 // 初始的 margin-bottom
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
//实现右侧表单
const tableRef = ref();
const data = ref([
{
  firstName: 'Mark',
  lastName: 'Otto',
  gender: 'Male',
  id: 'Mark',
},
{
  firstName: 'Jacob',
  lastName: 'Thornton',
  gender: 'Female',
  id: 'Jacob',
},
{
  firstName: 'Mark',
  lastName: 'Otto',
  gender: 'Male',
  id: 'Mark',
},
{
  firstName: 'Jacob',
  lastName: 'Thornton',
  gender: 'Female',
  id: 'Jacob',
},
{
  firstName: 'Mark',
  lastName: 'Otto',
  gender: 'Male',
  id: 'Mark',
},
{
  firstName: 'Jacob',
  lastName: 'Thornton',
  gender: 'Female',
  id: 'Jacob',
},
{
  firstName: 'Mark',
  lastName: 'Otto',
  gender: 'Male',
  id: 'Mark',
},
{
  firstName: 'Jacob',
  lastName: 'Thornton',
  gender: 'Female',
  id: 'Jacob',
},
{
  firstName: 'Mark',
  lastName: 'Otto',
  gender: 'Male',
  id: 'Mark',
},
{
  firstName: 'Jacob',
  lastName: 'Thornton',
  gender: 'Female',
  id: 'Jacob',
},
]);

//表单填写时的提示
const options = ref(['Female', 'Male']);
//入库按钮和暂存结果按钮
const showLoading = ref(false);

const change = (row, rowIndex, field, value) => {
  data.value[rowIndex][field] = typeof value === 'object' ? value.value : value;
  tableRef.value.store.setCellMode(row, rowIndex, field, 'readonly');
};
const blur = (row, rowIndex, field) => {
  tableRef.value.store.setCellMode(row, rowIndex, field, 'readonly');
};

const cellClick = (obj) => {
tableRef.value.store.setCellMode(obj.row, obj.rowIndex, obj.column.field, 'edit');
const refMap = {
  firstName: firstNameRef,
  lastName: lastNameRef,
  gender: genderRef,
};
const targetRef = refMap[obj.column.field];
nextTick(() => {
  targetRef?.value?.focus();
});
};


//右侧下方的字段列表
//字段选择
const fieldsAlert = ref<string[]>(['tag1', 'tag2', 'tag3'])
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()
const handleClose = (tag: string) => {
  fieldsAlert.value.splice(fieldsAlert.value.indexOf(tag), 1)
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
const handleInputConfirm = () => {
  if (inputValue.value) {
    fieldsAlert.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

//肯定会用到的功能，能够获取当前选中的元素，然后进行入库
//TODO:调用入库接口
const handleClick = () => {
  koiMsgBox("是否确定执行入库操作？")
  .then(async () => {
    showLoading.value = true;
    setTimeout(() => {
      showLoading.value = false;
    }, 2000);
    koiNoticeSuccess("入库成功!")
    console.log(tableRef.value.store.getCheckedRows());
  })
  .catch(() => {
    koiMsgError("已取消");
  });
};

const handleSaveClick = () => {
  koiMsgSuccess("暂存成功!");
}


function pageIndexChange(page: number): void {
  console.log(`当前页码: ${page}`);
  const imageWrapper = refs.imageWrapper.value; // 获取 imageWrapper 容器 DOM
  const wrapper = refs.wrapper.value; // 获取 wrapper 容器 DOM
  if (!wrapper || !imageWrapper) return;
  const deltaY = imageWrapper.scrollHeight / pager.total; // 每页的滚动高度
  console.log(`每页滚动高度: ${deltaY}`);
  // 计算新的滚动位置，基于当前页和目标页的差值
  const targetScrollTop = deltaY * (page - 1);
  console.log(`目标滚动位置: ${targetScrollTop}`);
  // 更新容器的滚动位置
  wrapper.scrollTop = targetScrollTop;
  console.log(`当前滚动位置: ${wrapper.scrollTop}`);
}

// box 容器也要跟着变化
const boxTransform = () => {
  refs.box.value.style.transform = `translate(-50%, -50%) rotate(${scaleData.rotate}deg) scale(${scaleData.scale})`;
};

// 旋转
// const rolate = () => {
//   scaleData.rotate += 90;
//   boxTransform();
// };

// // 点击放大缩小
// const rollBtn = (action: 'enlarge' | 'zoomin') => {
//   if (action === 'enlarge') {
//     scaleData.scale += scaleData.scaleBtn;
//   } else {
//     scaleData.scale -= scaleData.scaleBtn;
//   }
//   // 边界判断
//   if (scaleData.scale >= scaleData.scaleMax) {
//     scaleData.scale = scaleData.scaleMax;
//     return;
//   }
//   if (scaleData.scale <= scaleData.scaleMin) {
//     scaleData.scale = scaleData.scaleMin;
//     return;
//   }
//   boxTransform();
// };

// let isRecover = 0;
// 鼠标滚轮上下滑动
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

  // 计算当前页码
  const pageHeight = wrapper.scrollHeight / pager.total; // 每页高度
  const currentPage = Math.floor(wrapper.scrollTop / pageHeight) + 1;
  console.log("currentPage:" + currentPage)
  // 更新页码
  pager.pageIndex = currentPage;

  pager.total = totalImages

  console.log(`当前页码: ${pager.pageIndex}`);
}


// // 拖拽（box容器拖拽）
// function dragstart(e: MouseEvent) {
//   document.addEventListener('dragstart', (e) => e.preventDefault());
//   console.log("e.button:" + e.button)
//   if (e.button !== 0) return; // 确保只监听鼠标左键
//   refs.box.value.style.transition = 'none';
//   const box = refs.box.value as HTMLElement;
//   const wrapper = refs.wrapper.value as HTMLElement;
//   console.log("scrollTop1:" + wrapper.scrollTop)
//   dragData.x = e.pageX - box.offsetLeft;
//   dragData.y = e.pageY - box.offsetTop;
//   if(isRecover == 1){
//     isRecover = 0
//   }
//   let isMouseDown = true; // 用于记录鼠标是否按下
//   // 添加鼠标移动事件
//   document.addEventListener('mousemove', move);
//   function move(event: MouseEvent) {
//     if (!isMouseDown) return; // 确保只有鼠标按下时执行拖拽操作
//     // 计算元素的位置
//     dragData.left = event.pageX - dragData.x;
//     dragData.top = event.pageY - dragData.y;
//     console.log("event.pageY: " + event.pageY)
//     // 防止滚动超出边界
//     console.log("scrollTop2:" + wrapper.scrollTop)
//     console.log("dragData.y:" + dragData.y)
//     if (dragData.top > 0 && wrapper.scrollTop - dragData.top < 0) {
//       // wrapper.scrollTop = 0;
//       return;
//     } else if (dragData.top > wrapper.scrollHeight) {

//     } else {
//       // 设置元素的位置
//       box.style.left = dragData.left + 'px';
//       box.style.top = dragData.top + 'px';
//     }
//   }
//   // 鼠标抬起事件，移除监听
//   document.addEventListener('mouseup', () => {
//     console.log("1======" + wrapper.scrollTop)
//     console.log("dragData.top======" + dragData.top)
//     if (isRecover == 0){
//       wrapper.scrollTop = wrapper.scrollTop - dragData.top
//       isRecover = 1
//     }
//     console.log("wrapper.scrollTop======" + wrapper.scrollTop)
//     document.removeEventListener('mousemove', move);
//   }, { once: true });
// }

// 上传处理函数
async function beforeUpload(file) {
  // 检查文件类型，因为我上传图片类型的文件，后端并不会进行处理
  if (file.type.match(/^image\/(png|jpe?g)$/)) {
    // 执行图片相关操作
    // console.log("这是一个图片文件，执行图片操作");
    isImage = true
    isAllow = true
    // 例如上传图片或其他操作
  } else if (file.type.match(/^application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|pdf|vnd\.openxmlformats-officedocument\.presentationml\.presentation|vnd\.ms-powerpoint|ppt|vnd\.oasis\.opendocument\.text|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/)) {
    // 执行文档相关操作
    // console.log("这是一个文档文件，执行文档操作");
    isImage = false
    isAllow = true
    // 例如上传文档或其他操作
  } else {
    // 文件类型不符合要求
    koiMsgError("仅支持以下格式的文件：PNG, JPG, JPEG, DOC, DOCX, PDF, PPT, XLS, XLSX！");
    isAllow = false
    return false;
  }
  // 限制文件大小 (50MB)
  if (file.size > 50 * 1024 * 1024) {
    koiMsgError("文件大小不能超过 50MB！");
    return false;
  }
  return false;
}

async function handleFileChange(file) {
  i = 0
  //新增筛选代码,修改上传成果两次的bug
  console.log("isAllow:" + isAllow)
  if (file.status !== 'ready') return;
  if (!isAllow) return;
  const reader = new FileReader();
  // const imageFileTemp = null
  reader.onload = (e) => {
    if (e.target?.result) {
      //如果用户已经选中了一个文件，则将所选文件预览出来，将提示用户上传文件的icon隐藏起来
      var uc = document.getElementsByClassName('upload-content');
      var ua = document.getElementsByClassName('upload-alert');
      var table = document.getElementsByClassName('PeTableContainer');
      var addbut = document.getElementsByClassName('AddStoreButton');
      var lbd = document.getElementsByClassName('left-box-down');
      var lbu = document.getElementsByClassName('left-box-up');
      var iwr = document.getElementsByClassName('image_wrapper');
      var box = document.getElementsByClassName('box');
      var fc = document.getElementsByClassName('fieldContainer');
      var fhc = document.getElementsByClassName('fieldHeadContainer');
      
      uc[0].style.display = "none";
      ua[0].style.display = "none";
      iwr[0].style.display = "flex";
      lbd[0].style.display = "flex"
      box[0].style.display = "block";
      table[0].style.display = "block"
      addbut[0].style.display = "flex";
      lbu[0].style.backgroundColor = "#DCDFE4";
      fc[0].style.display = "flex";
      fhc[0].style.display = "flex";

      if (isImage){
        imageList.push(e.target.result)
      }
      koiMsgSuccess("文件上传成功！");
    }
  };
  //用户上传文件后调用后端接口
  let formData = new FormData();
  formData.append('file', file.raw); // `file.raw` 是 el-upload 提供的文件对象
  try {
    // 发送 POST 请求
    const data = await Yu.post("/upload_document", formData);
    if (!isImage){
      console.log('上传成功，返回转为图片的列表:', data.data.images);
      imageUrl.value = "data:image/jpeg;base64," + data.data.images["page_1"];
      var length = 0; // 初始化从后端拿到多少条数据
      //解析返回结果
      for (var item in data.data.images) {
        length++; // 计算 data.data.images 的键数
      }
      console.log("图片数量:", length);
      // 遍历 data.data.images 并将每一张图片的 Base64 数据添加到 imageList 中
      for (var i = 1; i <= length; i++) {
        // 拼接键名，比如 "page_1"
        const key = "page_" + i;
        // 如果键名存在于 data.data.images 中
        if (data.data.images[key]) {
          const base64Image = "data:image/jpeg;base64," + data.data.images[key];
          console.log("图片地址:", base64Image);
          // 添加到 imageList 中
          imageList.push(base64Image);
        } else {
          console.warn("未找到键:", key);
        }
      }
      //修改分页组件展示的结果
      totalImages = length
      console.log("totalImages: " + totalImages)
      pager.total = totalImages
      pager.pageIndex = 1
    }
  } catch (error) {
    koiMsgError("上传出错,请稍后重试！")
    console.error('上传出错:', error);
    // 错误处理逻辑，可以弹窗提示或者记录日志
  }
  // TODO:添加解析抽取结果函数
  Object.assign(parseObj, {name: "张三", age: "25"});
  renderData();
  reader.onerror = () => {
    koiMsgError("图片加载失败！");
  };
  reader.readAsDataURL(file.raw); // 注意是 file.raw
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
  // overflow-y: auto; /* 纵向滚动 */
  // overflow-x: hidden; /* 禁止横向滚动 */
  overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    // margin: 0 auto;
    background-color: #000000;
    // background-color: #F2F5FA;
    display: flex;
    overflow: hidden;
    background: linear-gradient(to bottom, #F2F5FA, #F2F5FA); /* 可选，便于调试 */
    .left-box {
        width: 50%;
        height: 90%;
      .left-box-up {
        // width: 100%;
        height: 100%;
        // background-color: #c0c0c0;
        background-color: #F2F5FA;
        position: relative;
        overflow: hidden;
        .box {
          width: 90%;
          height: 100%;  
          object-fit: contain;
          user-select: none; /* 不可选中,为了拖拽时不让文字高亮 */
          // overflow-y: scroll;
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center; 
          .image_wrapper{
            margin-top: 50%;
            width: 100%;
            display: none;
            flex-direction: column;
            align-items:center;
            .mask {
              margin-bottom: 10px;
              width: 100%;
              height: 100vh; /* 每页高度等于视口高度 */
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              border: 1px solid #ddd;
              background: #f5f5f5; /* 浅色背景 */
            }
            .preview-image {
              width: 100%;
              height: 100%; /* 图片自适应，但不会超过容器高度 */
              object-fit: contain;
            }
          }
          .upload-content{
            display: block;
            width: 100%;
            margin-top: 150%;
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
          top: 50%;
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
      position: relative;
      // 修改滚动条
      &::-webkit-scrollbar {
        width: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: #f0eded;
        border-radius: 10px;
      }
      // .item {
      //   min-height: 48px;
      //   // display: flex;
      //   display: none;
      //   padding-right: 50px;
      //   & + .item {
      //     margin-top: 10px;
      //   }
      //   .label {
      //     width: 100px;
      //     min-height: 48px;
      //     display: flex;
      //     align-items: center;
      //     justify-content: center;
      //     color: rgb(117, 122, 133);
      //     font-size: 14px;
      //     font-weight: 600;
      //     padding: 0 5px;
      //   }
      //   .text {
      //     flex: 1;
      //     color: #000000;
      //     background-color: #4977ea;
      //     border-radius: 10px;
      //     font-size: 14px;
      //     font-weight: 600;
      //     line-height: 24px;
      //     padding: 10px 20px;
      //   }
      // }
      .PeTableContainer{
        margin: 0px 2px;
        display: none;
      }
      .fieldContainer {
        position: absolute;
        width: 100%;
        bottom: 100px;
        display: none; /* 设置为水平排列 */
        align-items: center; /* 垂直居中对齐 */
        flex-wrap: wrap; /* 允许子元素换行 */
        border: 1px solid rgb(202, 202, 203); /* 边框颜色和宽度 */
        border-radius: 8px; /* 圆角半径 */
        padding: 7px; /* 内边距 */
        margin-bottom: 5px;
        .fieldLabel {
          margin-right: 10px; /* 和输入区域的间距 */
        }
      }
      .fieldHeadContainer{
        position: absolute;
        width: 100%;
        bottom: 60px;
        display: none; /* 设置为水平排列 */
        align-items: center; /* 垂直居中对齐 */
        flex-wrap: wrap; /* 允许子元素换行 */
        border: 1px solid rgb(202, 202, 203); /* 边框颜色和宽度 */
        border-radius: 8px; /* 圆角半径 */
        padding: 7px; /* 内边距 */
        .fieldLabel {
          margin-right: 10px; /* 和输入区域的间距 */
        }
      }
      .AddStoreButton{
        position: absolute;
        right: 10px;
        bottom: 10px;
        display: none;
        gap: 5px; //两个按钮之间的间距
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
