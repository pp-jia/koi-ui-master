<template>
  <div ref="refChart" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from 'vue';

const refChart = ref();
const chartInstance = ref();

onMounted(() => {
  initChart();
  window.addEventListener('resize', screenAdapter);
});

onUnmounted(() => {
  chartInstance.value.dispose();
  chartInstance.value = null;
  window.removeEventListener('resize', screenAdapter);
});

function initChart (){
  chartInstance.value = echarts.init(refChart.value);
  const option = {
  legend: {
    top: 'bottom'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      // dataView: { show: true, readOnly: false },
      // restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [35, 160],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' },
        { value: 26, name: 'rose 6' },
        { value: 22, name: 'rose 7' },
        { value: 18, name: 'rose 8' }
      ]
    }
  ]
};
  chartInstance.value.setOption(option);
};

const screenAdapter = () => {
  chartInstance.value.resize();
};
</script>

<style scoped lang="scss"></style>
