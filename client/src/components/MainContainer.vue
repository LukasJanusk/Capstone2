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
  margin-left: 0px;
}
</style>
