<template>
  <div ref="refChart" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const refChart = ref();
const chartInstance = ref();

onMounted(() => {
  initChart();
  window.addEventListener("resize", screenAdapter);
});

onUnmounted(() => {
  chartInstance.value.dispose();
  chartInstance.value = null;
  window.removeEventListener("resize", screenAdapter);
});

function initChart() {
  chartInstance.value = echarts.init(refChart.value);
  // 准备数据
  const option = {
    title: {
      text: "分析概览"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: ["需求人数", "提问数量"]
    },
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "需求人数",
        type: "bar",
        data: [2000, 3000, 4000, 5000, 6000, 7000, 8000],
        itemStyle: {
          color: "#d65c5c"
        }
      },
      {
        name: "提问数量",
        type: "bar",
        data: [2000, 3000, 3000, 4000, 5000, 5000, 6000],
        itemStyle: {
          color: "rgb(82.4, 155.2, 46.4)"
        }
      }
    ]
  };
  chartInstance.value.setOption(option);
}

const screenAdapter = () => {
  chartInstance.value.resize();
};
</script>

<style scoped lang="scss"></style>
