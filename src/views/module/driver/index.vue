<template>
  <div>
  <userDataChart></userDataChart>
  <el-row :gutter="20" class="m-t-5px">
    <!-- 注意：如果不进行操作数组，使用index当key没有问题，若是数组会用来增删改查则不能使用index当key。 -->
    <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">
      <el-card class="rounded-md dark:bg-black" shadow="hover">
        <pieChart></pieChart>
      </el-card>
    </el-col>
    <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">
      <el-card class="rounded-md dark:bg-black" shadow="hover">
        <radarChart></radarChart>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20" class="m-t-5px">
    <!-- 注意：如果不进行操作数组，使用index当key没有问题，若是数组会用来增删改查则不能使用index当key。 -->
    <el-col :span="18" :lg="18" :md="18" :sm="24" :xs="24">
      <el-card class="rounded-md dark:bg-black" shadow="hover">
        <columnRightChart></columnRightChart>
      </el-card>
    </el-col>
    <el-col :span="6" :lg="6" :md="6" :sm="24" :xs="24">
      <el-card class="rounded-md dark:bg-black" shadow="hover">
        <timeLineChart></timeLineChart>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script setup lang="ts" name="driverPage">
import pieChart from "./components/pieChart.vue";
import radarChart from "./components/radarChart.vue";
import userDataChart from "./components/userDataChart.vue";
import timeLineChart from "./components/timeLineChart.vue";
import columnRightChart from "./components/columnRightChart.vue";
</script>

<style scoped lang="scss"></style>
