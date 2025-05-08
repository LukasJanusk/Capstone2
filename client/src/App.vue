<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <UApp>
    <SideBar></SideBar>
    <RouterView v-slot="{ Component }">
      <TransitionFade mode="out-in" :duration="300">
        <component :is="Component" />
      </TransitionFade>
    </RouterView>
  </UApp>
</template>

<style></style>
