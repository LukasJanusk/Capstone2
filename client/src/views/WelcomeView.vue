import router from '@/router';
<script setup lang="ts">
import router from '@/router'
</script>
<template>
  <div>
    <h1>Welcome!</h1>
    <button @click="router.push({ name: 'SignIn' })">Sign in now</button>
  </div>
</template>
<style lang="css" scoped></style>
