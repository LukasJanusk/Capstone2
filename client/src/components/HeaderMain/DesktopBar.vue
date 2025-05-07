<script lang="ts" setup>
import { authUserId, logout } from '@/user'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <div
    class="fixed left-0 top-0 h-screen min-w-40 max-md:hidden flex flex-col gap-4 overflow-y-auto bg-background-primary text-foreground-primary"
  >
    <span class="font-bold text-xl mt-6">{{ route.name ? route.name : 'Menu' }}</span>
    <div class="flex flex-1 flex-col">
      <ULink active-class="font-bold" inactive-class="text-muted" to="/" as="button">Home</ULink>
      <ULink active-class="font-bold" inactive-class="text-muted" to="dashboard" as="button"
        >Dashboard</ULink
      >
    </div>
    <div class="m-1 gap-1 mt-auto flex flex-col">
      <UAvatar
        v-if="authUserId"
        class="mx-auto mt-6 mb-2"
        icon="i-lucide-user"
        size="3xl"
        src="./assets/user.png"
        alt="avatar"
      ></UAvatar>
      <UModal v-if="!authUserId" title="Sign in">
        <UButton class="mx-auto" size="md" label="Sign in" color="primary" variant="ghost" />
        <template #body>
          <div class="flex justify-center">
            <SignInForm class="h-56 m-2" />
          </div>
        </template>
      </UModal>
      <UModal v-if="!authUserId" title="Sign up">
        <UButton class="mx-auto" size="md" label="Sign up" color="primary" variant="ghost" />
        <template #body>
          <div class="flex justify-center">
            <SignupFrom class="h-100 m-2" />
          </div>
        </template>
      </UModal>
      <UModal v-if="authUserId" title="Are you sure?">
        <UButton class="mx-auto" size="lg" label="Sign Out" color="primary" variant="ghost" />
        <template #body>
          <UButton size="xl" @click="logout">Sign out</UButton>
        </template>
      </UModal>
    </div>
    <div class="mb-4"><ColorButton></ColorButton> <Onboarding></Onboarding></div>
    <USeparator orientation="vertical" class="fixed ml-40"></USeparator>
  </div>
</template>
