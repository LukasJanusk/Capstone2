import router from '@/router';
<script setup lang="ts">
import MainContainer from '@/components/MainContainer.vue'
import router from '@/router'
</script>
<template>
  <MainContainer>
    <div>
      <h1>Welcome!</h1>
      <button @click="router.push({ name: 'Sign In' })">Sign in now</button>
    </div>
  </MainContainer>
</template>
<style lang="css" scoped></style>
