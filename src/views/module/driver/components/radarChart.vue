<template>
  <div ref="refChart" style="width: 100%; height: 400px;"></div>
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
  const option = {
    title: {
      text: "Basic Radar Chart"
    },
    legend: {
      data: ["Allocated Budget", "Actual Spending"]
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: "Sales", max: 6500 },
        { name: "Administration", max: 16000 },
        { name: "Information Technology", max: 30000 },
        { name: "Customer Support", max: 38000 },
        { name: "Development", max: 52000 },
        { name: "Marketing", max: 25000 }
      ]
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: "Allocated Budget"
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: "Actual Spending"
          }
        ]
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
