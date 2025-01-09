<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="操作名称" prop="operName">
          <el-input
            placeholder="请输入操作名称"
            v-model="searchParams.operName"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="operIp">
          <el-input
            placeholder="请输入IP地址"
            v-model="searchParams.operIp"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作人员" prop="operMan">
          <el-input
            placeholder="请输入操作人员名字"
            v-model="searchParams.operMan"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="访问时间" prop="loginTime">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" plain v-debounce="handleSearch">搜索</el-button>
          <el-button type="danger" icon="refresh" plain v-throttle="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5" v-auth="['system:role:delete']">
          <el-button type="danger" icon="delete" plain @click="handleBatchDelete()" :disabled="multiple">删除</el-button>
        </el-col>
        <KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleListPage"></KoiToolbar>
      </el-row>

      <br />
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        border
        :data="tableList"
        empty-text="暂时没有数据哟🌻"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" prop="operId" width="70px" align="center" type="index"></el-table-column>
        <el-table-column
          label="产品名称"
          prop="productName"
          width="180px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="型号"
          prop="model"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="规格"
          prop="spec"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="参数"
          prop="parameters"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="供应商/制造厂商"
          prop="supplier"
          width="200px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="申报价格"
          prop="bidPrice"
          width="100px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="项目审核价格"
          prop="approvedPrice"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="审定价"
          prop="approvalStatus"
          width="100px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="其他参考价"
          prop="referencePrice"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="时间"
          prop="time"
          width="180px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="项目名称"
          prop="projectName"
          width="200px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="删除🌻" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
                v-auth="['system:role:delete']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="查看🌻" placement="top">
              <el-button
                type="primary"
                icon="View"
                circle
                plain
                @click="handleView(row)"
                v-auth="['system:role:list']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <br />
      <!-- {{ searchParams.pageNo }} --- {{ searchParams.pageSize }} -->
      <!-- 分页 -->
      <el-pagination
        background
        v-model:current-page="searchParams.pageNo"
        v-model:page-size="searchParams.pageSize"
        v-show="total > 0"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleListPage"
        @current-change="handleListPage"
      />

      <KoiDialog ref="koiDialogRef" :title="title" top="6vh" :height="660" :width="800" :footerHidden="true">
        <template #content>
          <!-- 描述列表 -->
          <el-descriptions direction="vertical" :column="3" border>
            <el-descriptions-item label="方法名称">{{ form.methodName }}</el-descriptions-item>
            <el-descriptions-item label="消耗时间[毫秒]">{{ form.costTime }}</el-descriptions-item>
            <el-descriptions-item label="操作状态">
              <el-tag :type="form.operStatus == '0' ? '' : form.operStatus == '1' ? 'danger' : 'warning'">
                {{ form.operStatus == "0" ? "操作成功" : form.operStatus == "1" ? "操作失败" : "未知状态" }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="异常信息" v-if="form.operStatus == '1'" :span="3">{{
              form.costTime
            }}</el-descriptions-item>
            <el-descriptions-item label="请求参数" :span="3">{{ form.operParam }}</el-descriptions-item>
            <el-descriptions-item label="返回数据" :span="3">{{ form.jsonResult }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </KoiDialog>
    </KoiCard>
  </div>
</template>

<script setup lang="ts" name="operlogPage">
import { ref, onMounted } from "vue";
// @ts-ignore
import { koiNoticeSuccess, koiNoticeError, koiMsgWarning, koiMsgBox, koiMsgInfo, koiMsgError } from "@/utils/koi.ts";
// @ts-ignore
import { koiDatePicker } from "@/utils/index.ts";
// @ts-ignore
import { listPage, getById, deleteById, batchDelete, getDetailById } from "@/api/system/operlog/index.ts";

// 数据表格加载页面动画
const loading = ref(false);
/** 是否显示搜索表单 */
const showSearch = ref<boolean>(true); // 默认显示搜索条件
// 数据表格数据
const tableList = ref<any>([
  {
  productName: "激光测距仪",
    model: "LX-500",
    spec: "高精度",
    parameters: JSON.stringify({
      "测量量程": "0.15-60m",
      "激光参数": "635纳米",
      "激光等级": "2级"
    }),
    supplier: "XXX科技有限公司",
    bidPrice: 320000,
    approvedPrice: 320000,
    approvalStatus: "通过",
    referencePrice: null,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "工业无人机",
    model: "DR-900",
    spec: "标配",
    parameters: JSON.stringify({
      '空载转速（米/分钟）': "0-192",
      "测量量程": "1-20km",
      "最大续航时间": "120分钟"
    }),
    supplier: "YYY无人机厂商",
    bidPrice: 400000,
    approvedPrice: 380000,
    approvalStatus: "调整",
    referencePrice: 395000,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "热成像仪",
    model: "HT-700",
    spec: "红外",
    parameters: JSON.stringify({
      "分辨率": "640x480",
      "测温范围": "-20°C 至 600°C",
      "焦距": "25mm"
    }),
    supplier: "ZZZ电子设备厂",
    bidPrice: 310000,
    approvedPrice: 310000,
    approvalStatus: "通过",
    referencePrice: null,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "零星耗材",
    model: "ABC",
    spec: "普通",
    parameters: JSON.stringify({
      "材质": "塑料",
      "包装规格": "100个/批",
      "颜色": "随机"
    }),
    supplier: "供应链A公司",
    bidPrice: 280000,
    approvedPrice: 280000,
    approvalStatus: "通过",
    referencePrice: 285000,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "智能分析系统",
    model: "AAA-Tech",
    spec: "旗舰版",
    parameters: JSON.stringify({
      "运算能力": "1000TFLOPS",
      "存储容量": "2PB",
      "网络接口": "10GbE"
    }),
    supplier: "科技研发X企业",
    bidPrice: 880000,
    approvedPrice: 800000,
    approvalStatus: "调整",
    referencePrice: 850000,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "便携式气象站",
    model: "WX-P800",
    spec: "高端",
    parameters: JSON.stringify({
      "风速测量范围": "0.3-30m/s",
      "温度测量范围": "-40°C 至 60°C",
      "湿度测量范围": "0-100%"
    }),
    supplier: "气象设备B厂商",
    bidPrice: 360000,
    approvedPrice: 360000,
    approvalStatus: "通过",
    referencePrice: null,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "自动化生产设备",
    model: "XZ-300",
    spec: "定制",
    parameters: JSON.stringify({
      "生产速度": "60件/小时",
      "电压": "220V",
      "功率": "15kW"
    }),
    supplier: "工业C制造商",
    bidPrice: 950000,
    approvedPrice: 940000,
    approvalStatus: "调整",
    referencePrice: null,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "高精度激光测量仪",
    model: "LaserX-900",
    spec: "增强版",
    parameters: JSON.stringify({
      "测量量程": "0.05-120m",
      "精度": "±1mm",
      "激光等级": "2级"
    }),
    supplier: "精密仪器D公司",
    bidPrice: 480000,
    approvedPrice: 470000,
    approvalStatus: "通过",
    referencePrice: 490000,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "移动式水质监测站",
    model: "Water-Q300",
    spec: "标准版",
    parameters: JSON.stringify({
      "监测范围": "pH, COD, BOD",
      "电池续航时间": "8小时",
      "数据传输方式": "无线"
    }),
    supplier: "环保设备E供应商",
    bidPrice: 720000,
    approvedPrice: 700000,
    approvalStatus: "调整",
    referencePrice: 750000,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  },
  {
    productName: "高速数据处理服务器",
    model: "DataCore-5000",
    spec: "旗舰版",
    parameters: JSON.stringify({
      "CPU": "128核",
      "内存": "2TB",
      "存储容量": "10PB"
    }),
    supplier: "服务器制造F企业",
    bidPrice: 1200000,
    approvedPrice: 1150000,
    approvalStatus: "通过",
    referencePrice: 1250000,
    time: "2025-01-09 01:31:34",
    projectName: "1"
  }
]);

// 查询参数
const searchParams = ref({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  operName: "",
  operIp: "",
  operMan: ""
});
const total = ref<number>(0);
// 时间
const dateRange = ref();
// 重置搜索参数
const resetSearchParams = () => {
  dateRange.value = [];
  searchParams.value = {
    pageNo: 1,
    pageSize: 10,
    operName: "",
    operIp: "",
    operMan: ""
  };
};
/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  searchParams.value.pageNo = 1;
  handleListPage();
};
/** 重置 */
const resetSearch = () => {
  console.log("重置搜索");
  resetSearchParams();
  handleListPage();
};

/** @current-change：点击分页组件页码发生变化：例如：切换第2、3页 OR 上一页 AND 下一页 OR 跳转某一页 */
/** @size-change：点击分页组件下拉选中条数发生变化：例如：选择10条/页、20条/页等 */
// 分页查询，@current-change AND @size-change都会触发分页，调用后端分页接口
/** 数据表格 */
const handleListPage = async () => {
  total.value = 200;
  // try {
  //   loading.value = true;
  //   tableList.value = []; // 重置表格数据
  //   const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
  //   console.log("操作日志数据表格数据->", res.data);
  //   tableList.value = res.data.records;
  //   total.value = res.data.total;
  //   loading.value = false;
  // } catch (error) {
  //   console.log(error);
  //   koiNoticeError("数据查询失败，请刷新重试🌻");
  // }
};

/** 数据表格[删除、批量删除等刷新使用] */
const handleTableData = async () => {
  try {
    const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
    console.log("操作日志数据表格数据->", res.data);
    tableList.value = res.data.records;
    total.value = res.data.total;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试🌻");
  }
};

// 静态页面防止报错(可直接删除)
// @ts-ignore
const handleStaticPage = () => {
  listPage(searchParams.value);
};

onMounted(() => {
  // 获取数据表格数据
  handleListPage();
});

const ids = ref([]); // 选中数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用
/** 是否多选 */
const handleSelectionChange = (selection: any) => {
  // console.log(selection);
  ids.value = selection.map((item: any) => item.operId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.operId;
  if (id == null || id == "") {
    koiMsgWarning("请选中需要删除的数据🌻");
  }
  koiMsgBox("您确认需要删除操作名称[" + row.operName + "]么？")
    .then(async () => {
      try {
        await deleteById(id);
        handleTableData();
        koiNoticeSuccess("删除成功🌻");
      } catch (error) {
        console.log(error);
        handleTableData();
        koiNoticeError("删除失败，请刷新重试🌻");
      }
    })
    .catch(() => {
      koiMsgError("已取消🌻");
    });
};

/** 批量删除 */
const handleBatchDelete = () => {
  if (ids.value.length == 0) {
    koiMsgInfo("请选择需要删除的数据🌻");
    return;
  }
  koiMsgBox("您确认需要进行批量删除么？")
    .then(async () => {
      try {
        // console.log("ids", ids.value);
        await batchDelete(ids.value);
        handleTableData();
        koiNoticeSuccess("批量删除成功🌻");
      } catch (error) {
        console.log(error);
        koiNoticeError("批量删除失败，请刷新重试🌻");
        handleTableData();
      }
    })
    .catch(() => {
      koiMsgError("已取消🌻");
    });
};

/** 打开Drawer */
const handleView = async (row: any) => {
  const id = row.operId;
  if (!id) {
    koiMsgError("请传递需要查询的条件🌻");
  }
  // 重置表单
  resetForm();
  // 标题
  title.value = "描述列表";
  try {
    const res: any = await getDetailById(id);
    console.log("操作日志数据表格数据->", res.data);
    form.value = res.data;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试🌻");
  }
  koiDialogRef.value.koiOpen();
};

/** 添加 AND 修改弹出框 */
const koiDialogRef = ref();
/** 打开Dialog操作 */
const title = ref("描述列表");

// form表单
let form = ref<any>({
  methodName: "",
  operParam: "",
  jsonResult: "",
  operStatus: "",
  errorMsg: "",
  costTime: ""
});

/** 清空表单数据 */
const resetForm = () => {
  form.value = {
    methodName: "",
    operParam: "",
    jsonResult: "",
    operStatus: "",
    errorMsg: "",
    costTime: ""
  };
};
</script>

<style lang="scss" scoped></style>
