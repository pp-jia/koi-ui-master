<template>
  <div class="zhjxMain">
    <div class="content">
      <!-- 展示容器 -->
      <div class="left-box">
        <div class="left-box-up" :ref="refs.wrapper" @wheel.prevent="scaleWheel($event)">
          <div class="box" :ref="refs.box" @mousedown="dragstart($event)">
            <vue-pdf-embed :ref="refs.box" :source="pdfSource" :style="scaleFun" class="vue-pdf-embed" :page="activePage" />
          </div>
          <input type="file" @change="onFileChange" />
        </div>
        <div class="left-box-down">
          <div class="zoomin-wrapper">
            <img src="../../../assets/icons/pe-bigger.svg" @click="rollBtn('enlarge')" alt="" />
            <img src="../../../assets/icons/pe-smaller.svg" @click="rollBtn('zoomin')" alt="" />
            <img src="../../../assets/icons/pe-inverse.svg" alt="" @click="rolate" />
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="item" v-for="(value, key) in parseObj">
          <div class="label">{{ key }}</div>
          <div class="text">
            {{ value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';

//默认的pdf
import testpdf1 from '../../../assets/pdfs/1.pdf';

const pdfSource = ref(testpdf1);

const props = defineProps<{
  activePage: number;
}>();

const parseObj = ref({
  设备名称: '1RPEOOIBA冷却剂疏水泵',
  功能位置: 'ND-4-01-RGL-010AR',
  缺陷原因: `取工作票，现场确认设备位号及安措正确
拆卸联轴器螺栓，对中复查同轴度 0.08mm平行度0.03mm不合格
拆卸泵盖螺栓，将泵憋体脱出运至检修场地，临时开口设备做好封堵拆卸叶轮及机械密封组件，解体轴承箱，消洗检查各零部件，测量泵轴最大0.0...大0.02mm，轴与轴承配合间隙最大0.01mm，轴与叶轮配合间隙0.02mm，体口环与叶回装新轴承及机械密封组件，安装泵叶轮，将泵整体运往现场回装，至工作油位，调整对中同轴度 0.03mm平行度 0.025mm，合格
回装联轴器及保护單，清理现场
归还工作票及辐射票完工，修后试验在工单01447934-02中执行`,
  处理措施: `1RPB002P0 解体检查工作完成`,
  处理结果: `取工作票，现场确认设备位号及安措正确
拆卸联轴器螺栓，对中复查同轴度 0.08mm平行度0.03mm不合格
拆卸泵盖螺栓，将泵憋体脱出运至检修场地，临时开口设备做好封堵拆卸叶轮及机械密封组件，解体轴承箱，消洗检查各零部件，测量泵轴最大0.0...大0.02mm，轴与轴承配合间隙最大0.01mm，轴与叶轮配合间隙0.02mm，体口环与叶回装新轴承及机械密封组件，安装泵叶轮，将泵整体运往现场回装，至工作油位，调整对中同轴度 0.03mm平行度 0.025mm，合格
回装联轴器及保护單，清理现场
归还工作票及辐射票完工，修后试验在工单01447934-02中执行`,
  其他字段1: `取工作票，现场确认设备位号及安措正确
拆卸联轴器螺栓，对中复查同轴度 0.08mm平行度0.03mm不合格
拆卸泵盖螺栓，将泵憋体脱出运至检修场地，临时开口设备做好封堵拆卸叶轮及机械密封组件，解体轴承箱，消洗检查各零部件，测量泵轴最大0.0...大0.02mm，轴与轴承配合间隙最大0.01mm，轴与叶轮配合间隙0.02mm，体口环与叶回装新轴承及机械密封组件，安装泵叶轮，将泵整体运往现场回装，至工作油位，调整对中同轴度 0.03mm平行度 0.025mm，合格
回装联轴器及保护單，清理现场
归还工作票及辐射票完工，修后试验在工单01447934-02中执行`,
  我是很长的字段名称: `取工作票，现场确认设备位号及安措正确
拆卸联轴器螺栓，对`,
  其他字段2: `取工作票，现场确认设备位号及安措正确
拆卸联轴器螺栓，对中复查同轴度 0.08mm平行度0.03mm不合格
拆卸泵盖螺栓，将泵憋体脱出运至检修场地，临时开口设备做好封堵拆卸叶轮及机械密封组件，解体轴承箱，消洗检查各零部件，测量泵轴最大0.0...大0.02mm，轴与轴承配合间隙最大0.01mm，轴与叶轮配合间隙0.02mm，体口环与叶回装新轴承及机械密封组件，安装泵叶轮，将泵整体运往现场回装，至工作油位，调整对中同轴度 0.03mm平行度 0.025mm，合格
回装联轴器及保护單，清理现场
归还工作票及辐射票完工，修后试验在工单01447934-02中执行`,
  其他字段3: `取工作票，现场确认设备位号及安措正确
拆卸联轴器螺栓，对中复查同轴度 0.08mm平行度0.03mm不合格
拆卸泵盖螺栓，将泵憋体脱出运至检修场地，临时开口设备做好封堵拆卸叶轮及机械密封组件，解体轴承箱，消洗检查各零部件，测量泵轴最大0.0...大0.02mm，轴与轴承配合间隙最大0.01mm，轴与叶轮配合间隙0.02mm，体口环与叶回装新轴承及机械密封组件，安装泵叶轮，将泵整体运往现场回装，至工作油位，调整对中同轴度 0.03mm平行度 0.025mm，合格
回装联轴器及保护單，清理现场
归还工作票及辐射票完工，修后试验在工单01447934-02中执行`,
});

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
  // if (dy < 0) {
  //   scaleData.scale -= scaleData.scaleNum;
  // } else {
  //   // console.log('放大');
  //   scaleData.scale += scaleData.scaleNum;
  // }
  // // 边界判断
  // if (scaleData.scale >= scaleData.scaleMax) {
  //   scaleData.scale = scaleData.scaleMax;
  //   return;
  // }
  // if (scaleData.scale <= scaleData.scaleMin) {
  //   scaleData.scale = scaleData.scaleMin;
  //   return;
  // }
  // boxTransform();
  // 禁用默认滚动行为
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

// 处理文件上传
const onFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file && file.type === 'application/pdf') {
    const url = URL.createObjectURL(file);
    pdfSource.value = url; // 更新为用户上传的PDF文件
  }
};

</script>

<style scoped lang="scss">
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
    display: flex;
    overflow: hidden;
    background: linear-gradient(to bottom, #ffffff, #ffffff); /* 可选，便于调试 */
    .left-box {
        width: 50%;
        height: 90%;
      .left-box-up {
        // width: 50%;
        height: 100%;
        background-color: #c0c0c0;
        margin-right: 10px;
        position: relative;
        overflow: hidden;
        .box {
          // width: 80%;
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
          .vue-pdf-embed {
            width: 100%;
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
        // width: 50%;
        height: 10%;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center;     /* 垂直居中 */
        position: relative;      /* 确保可以在内部精确定位 */
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
            width: 60px;
            height: 60px;
            cursor: pointer;
            margin: 0 100px;
          }
        }
      }
    }
    .right-box {
      width: 50%;
      height: 100%;
      background-color: #000000;
      margin-left: 10px;
      padding: 10px 0;
      overflow-y: scroll;
      //   修改滚动条
      &::-webkit-scrollbar {
        width: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: #f0eded;
        border-radius: 10px;
      }
      .item {
        min-height: 48px;
        display: flex;
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
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          padding: 0 5px;
        }
        .text {
          flex: 1;
          color: #ffffff;
          background-color: #4977ea;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          line-height: 24px;
          padding: 10px 20px;
        }
      }
    }
  }
}
</style>
