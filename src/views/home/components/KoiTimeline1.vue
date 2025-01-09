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
    content: "KOI-ADMIN🌻 开启了崭新的人生！",
    timestamp: "2023-11-23 18:00:00",
    type: "primary"
  },
  {
    content: "企业级中后台管理平台",
    timestamp: "2023-11-23 18:00:00",
    type: "success"
  },
];
</script>

<style scoped></style>
