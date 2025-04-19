<script setup lang="ts">
import router from '@/router'
import SignupFrom from '@/components/SignupForm/SignupFrom.vue'
import MainContainer from '@/components/MainContainer.vue'
</script>
<template>
  <MainContainer>
    <SignupFrom @signup="router.push({ name: 'Welcome' })"></SignupFrom>
  </MainContainer>
</template>

<style lang="css" scoped></style>
