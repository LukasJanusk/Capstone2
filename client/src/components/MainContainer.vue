<script setup lang="ts">
import { showHeader } from '@/user'
</script>

<template>
  <div :class="['main-container', { collapsed: !showHeader }]">
    <slot></slot>
  </div>
</template>

<style lang="css" scoped>
.main-container {
  margin-left: 120px;
  transition: margin-left 0.6s ease;
}

.main-container.collapsed {
  margin-left: 10px;
  margin-right: 10px;
}
@media (width<=600px) {
  .main-container {
    position: relative;
    margin-right: 0px;
    margin-top: 0px;
  }
}
</style>
