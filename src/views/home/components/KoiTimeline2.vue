<template>
  <el-timeline>
    <el-timeline-item v-for="(activity, index) in activities" :key="index" :type="activity.type" :timestamp="activity.timestamp">
      {{ activity.content }}
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
const activities = [
  {
    content: "新增 15121 条问题，15281 条已解决🌻",
    timestamp: "2024-12-27 周五",
    type: "primary"
  },
  {
    content: "新增 15772 条问题，13676 条已解决",
    timestamp: "2024-12-26 周四",
    type: "success"
  },
  {
    content:
      "新增 18477 条问题，14267 条已解决",
    timestamp: "2024-12-25 周三",
    type: "warning"
  },
  {
    content:
      "新增 16267 条问题，14739 条已解决",
    timestamp: "2024-12-24 周二",
    type: "info"
  },
  {
    content:
      "新增 14003 条问题，17573 条已解决",
    timestamp: "2024-12-23 周五",
    type: "danger"
  },
  {
    content:
      "新增 14003 条问题，17573 条已解决",
    timestamp: "2024-12-23 周四",
    type: "primary"
  },
  {
    content:
      "新增 14003 条问题，17573 条已解决",
    timestamp: "2024-12-23 周三",
    type: "success"
  },
  {
    content:
      "新增 14003 条问题，17573 条已解决",
    timestamp: "2024-12-23 周二",
    type: "primary"
  },
  {
    content:
      "新增 14003 条问题，17573 条已解决",
    timestamp: "2024-12-23 周一",
    type: "danger"
  },
];
</script>

<style scoped></style>
