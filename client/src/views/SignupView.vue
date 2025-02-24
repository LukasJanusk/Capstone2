<script setup lang="ts">
import router from '@/router'
import SignupFrom from '@/components/SignupFrom.vue'
</script>
<template>
  <SignupFrom @signup="router.push({ name: 'Welcome' })"></SignupFrom>
</template>

<style lang="css" scoped></style>
