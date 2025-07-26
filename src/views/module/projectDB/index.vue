<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="项目名称" prop="operName" style="align-items: center">
          <el-input
            placeholder="请输入操作名称"
            v-model="searchParams.operName"
            style="width: 150px;height: 30px;"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="operIp" style="align-items: center;">
          <el-input
            placeholder="请输入单位名称"
            v-model="searchParams.operIp"
            style="width: 150px;height: 30px;"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作人员" prop="operMan" style="align-items: center;">
          <el-input
            placeholder="请输入操作人员"
            v-model="searchParams.operMan"
            style="width: 150px;height: 30px;"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="访问时间" prop="loginTime" style="align-items: center;">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
            style="height: 30px;"
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
        <el-table-column label="序号" prop="projectId" width="70px" align="center" type="index"></el-table-column>
        <el-table-column
          label="项目名称"
          prop="projectName"
          width="180px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="状态" prop="status" width="120px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="来源" prop="source" width="120px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          label="项目类型"
          prop="projectType"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="参研单位"
          prop="researchUnit"
          width="200px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="总体单位"
          prop="overallUnit"
          width="100px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="项目资料"
          prop="projectDocuments"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="经费概要"
          prop="fundingSummary"
          width="100px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="项目经理"
          prop="projectManager"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="上传系统时间"
          prop="uploadSystemTime"
          width="180px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="上传数据包"
          prop="uploadDataPackage"
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
          <el-descriptions direction="vertical" :column="3">
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

<script setup lang="ts" name="projectPage">
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
    projectName: "人工智能研究开发",
    status: "进行中",
    source: "政府资助",
    projectType: "研究",
    researchUnit: "人工智能研究所",
    overallUnit: "科技创新有限公司",
    totalApplicationFundingWan: 500,
    totalReviewFundingWan: 480,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 4,
    evaluationReport: "进行中",
    projectDocuments: "文档链接",
    fundingSummary: "已批准",
    projectManager: "张三",
    uploadSystemTime: "2025-01-01 10:00",
    uploadDataPackage: "数据包1",
    action: "提交"
  },
  {
    projectName: "量子计算计划",
    status: "已完成",
    source: "大学资助",
    projectType: "研究",
    researchUnit: "量子计算实验室",
    overallUnit: "量子创新公司",
    totalApplicationFundingWan: 300,
    totalReviewFundingWan: 280,
    adjustmentAmountWan: 10,
    adjustmentRatioPercent: 3.33,
    evaluationReport: "已完成",
    projectDocuments: "文档链接",
    fundingSummary: "已结算",
    projectManager: "李四",
    uploadSystemTime: "2024-12-15 15:30",
    uploadDataPackage: "数据包2",
    action: "审核"
  },
  {
    projectName: "智慧城市建设",
    status: "待审",
    source: "私人投资",
    projectType: "建设",
    researchUnit: "城市规划研究院",
    overallUnit: "城市发展有限公司",
    totalApplicationFundingWan: 1000,
    totalReviewFundingWan: 950,
    adjustmentAmountWan: 50,
    adjustmentRatioPercent: 5,
    evaluationReport: "待审",
    projectDocuments: "文档链接",
    fundingSummary: "待审",
    projectManager: "王五",
    uploadSystemTime: "2025-01-10 09:45",
    uploadDataPackage: "数据包3",
    action: "提交"
  },
  {
    projectName: "医疗机器人研究",
    status: "进行中",
    source: "研究基金",
    projectType: "研究",
    researchUnit: "机器人技术研究院",
    overallUnit: "医科技术解决方案",
    totalApplicationFundingWan: 800,
    totalReviewFundingWan: 780,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 2.5,
    evaluationReport: "进行中",
    projectDocuments: "文档链接",
    fundingSummary: "已批准",
    projectManager: "李华",
    uploadSystemTime: "2025-01-05 14:00",
    uploadDataPackage: "数据包4",
    action: "提交"
  },
  {
    projectName: "太空探索计划",
    status: "已完成",
    source: "政府资助",
    projectType: "研究",
    researchUnit: "太空研究中心",
    overallUnit: "航空航天技术公司",
    totalApplicationFundingWan: 1200,
    totalReviewFundingWan: 1150,
    adjustmentAmountWan: 30,
    adjustmentRatioPercent: 2.5,
    evaluationReport: "已完成",
    projectDocuments: "文档链接",
    fundingSummary: "已结算",
    projectManager: "赵六",
    uploadSystemTime: "2024-12-20 11:20",
    uploadDataPackage: "数据包5",
    action: "审核"
  },
  {
    projectName: "清洁能源解决方案",
    status: "进行中",
    source: "环保基金",
    projectType: "研究",
    researchUnit: "清洁能源实验室",
    overallUnit: "生态技术公司",
    totalApplicationFundingWan: 600,
    totalReviewFundingWan: 590,
    adjustmentAmountWan: 10,
    adjustmentRatioPercent: 1.67,
    evaluationReport: "进行中",
    projectDocuments: "文档链接",
    fundingSummary: "已批准",
    projectManager: "刘杰",
    uploadSystemTime: "2025-01-02 13:15",
    uploadDataPackage: "数据包6",
    action: "提交"
  },
  {
    projectName: "区块链安全研究",
    status: "待审",
    source: "私人投资",
    projectType: "技术开发",
    researchUnit: "区块链实验室",
    overallUnit: "安全技术创新公司",
    totalApplicationFundingWan: 500,
    totalReviewFundingWan: 480,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 4,
    evaluationReport: "待审",
    projectDocuments: "文档链接",
    fundingSummary: "待审",
    projectManager: "张强",
    uploadSystemTime: "2025-01-07 16:00",
    uploadDataPackage: "数据包7",
    action: "审核"
  },
  {
    projectName: "农业创新技术",
    status: "已完成",
    source: "政府资助",
    projectType: "研究",
    researchUnit: "农业研究所",
    overallUnit: "农业技术公司",
    totalApplicationFundingWan: 700,
    totalReviewFundingWan: 680,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 2.86,
    evaluationReport: "已完成",
    projectDocuments: "文档链接",
    fundingSummary: "已结算",
    projectManager: "陈娜",
    uploadSystemTime: "2024-12-25 10:00",
    uploadDataPackage: "数据包8",
    action: "审核"
  },
  {
    projectName: "智能制造系统",
    status: "进行中",
    source: "私人投资",
    projectType: "技术开发",
    researchUnit: "制造技术实验室",
    overallUnit: "智能技术产业公司",
    totalApplicationFundingWan: 900,
    totalReviewFundingWan: 880,
    adjustmentAmountWan: 30,
    adjustmentRatioPercent: 3.33,
    evaluationReport: "进行中",
    projectDocuments: "文档链接",
    fundingSummary: "已批准",
    projectManager: "孙明",
    uploadSystemTime: "2025-01-04 17:45",
    uploadDataPackage: "数据包9",
    action: "提交"
  },
  {
    projectName: "医疗AI技术研究",
    status: "待审",
    source: "研究基金",
    projectType: "研究",
    researchUnit: "医疗AI实验室",
    overallUnit: "医疗科技创新公司",
    totalApplicationFundingWan: 800,
    totalReviewFundingWan: 780,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 2.5,
    evaluationReport: "待审",
    projectDocuments: "文档链接",
    fundingSummary: "待审",
    projectManager: "周强",
    uploadSystemTime: "2025-01-08 12:30",
    uploadDataPackage: "数据包10",
    action: "审核"
  },
  {
    projectName: "区块链安全研究",
    status: "待审",
    source: "私人投资",
    projectType: "技术开发",
    researchUnit: "区块链实验室",
    overallUnit: "安全技术创新公司",
    totalApplicationFundingWan: 500,
    totalReviewFundingWan: 480,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 4,
    evaluationReport: "待审",
    projectDocuments: "文档链接",
    fundingSummary: "待审",
    projectManager: "张强",
    uploadSystemTime: "2025-01-07 16:00",
    uploadDataPackage: "数据包7",
    action: "审核"
  },
  {
    projectName: "农业创新技术",
    status: "已完成",
    source: "政府资助",
    projectType: "研究",
    researchUnit: "农业研究所",
    overallUnit: "农业技术公司",
    totalApplicationFundingWan: 700,
    totalReviewFundingWan: 680,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 2.86,
    evaluationReport: "已完成",
    projectDocuments: "文档链接",
    fundingSummary: "已结算",
    projectManager: "陈娜",
    uploadSystemTime: "2024-12-25 10:00",
    uploadDataPackage: "数据包8",
    action: "审核"
  },
  {
    projectName: "智能制造系统",
    status: "进行中",
    source: "私人投资",
    projectType: "技术开发",
    researchUnit: "制造技术实验室",
    overallUnit: "智能技术产业公司",
    totalApplicationFundingWan: 900,
    totalReviewFundingWan: 880,
    adjustmentAmountWan: 30,
    adjustmentRatioPercent: 3.33,
    evaluationReport: "进行中",
    projectDocuments: "文档链接",
    fundingSummary: "已批准",
    projectManager: "孙明",
    uploadSystemTime: "2025-01-04 17:45",
    uploadDataPackage: "数据包9",
    action: "提交"
  },
  {
    projectName: "医疗AI技术研究",
    status: "待审",
    source: "研究基金",
    projectType: "研究",
    researchUnit: "医疗AI实验室",
    overallUnit: "医疗科技创新公司",
    totalApplicationFundingWan: 800,
    totalReviewFundingWan: 780,
    adjustmentAmountWan: 20,
    adjustmentRatioPercent: 2.5,
    evaluationReport: "待审",
    projectDocuments: "文档链接",
    fundingSummary: "待审",
    projectManager: "周强",
    uploadSystemTime: "2025-01-08 12:30",
    uploadDataPackage: "数据包10",
    action: "审核"
  },
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
