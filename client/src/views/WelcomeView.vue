import router from '@/router';
<script setup lang="ts">
import MainContainer from '@/components/MainContainer.vue'
import router from '@/router'
import { onBoardComplete } from '@/user'
import Onboarding from '@/components/Onboarding.vue'
</script>
<template>
  <div>
    <MainContainer>
      <div>
        <h1 class="font-bold text-5xl pb-4">Welcome!</h1>
        <UButton
          color="primary"
          variant="subtle"
          class="text-xl"
          @click="router.push({ name: 'Sign In' })"
          loading-auto
          >Sign in
        </UButton>
        <div>
          <Onboarding @close="onBoardComplete = true"></Onboarding>
        </div>
      </div>
    </MainContainer>
  </div>
</template>
<style lang="css" scoped></style>
