<script setup lang="ts">
// import ParaliaxRolling from "./components/ParaliaxRolling/index.vue";
// import MEarth from "./components/MagicEarth/MEarth.vue";
</script>

<template>
  <div class="app-container">
    <!-- <ParaliaxRolling /> 视差滚动背景-->
    <!-- <MEarth /> -->
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}
</style>
