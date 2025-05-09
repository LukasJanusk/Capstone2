<script lang="ts" setup>
import router from '@/router'
import { authUserId, logout } from '@/user'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const showSignup = ref(false)
const signOut = () => {
  logout()
  router.push({ name: 'Sign In' })
}
</script>
<template>
  <div
    class="fixed left-0 top-0 h-screen min-w-40 max-md:hidden flex flex-col gap-4 overflow-y-auto text-foreground-primary"
  >
    <span class="font-bold text-xl mt-6">{{ route.name ? route.name : 'Menu' }}</span>
    <div class="flex flex-1 flex-col">
      <ULink active-class="font-bold" inactive-class="text-muted" to="/" as="button">Home</ULink>
      <ULink
        v-if="authUserId"
        active-class="font-bold"
        inactive-class="text-muted"
        to="dashboard"
        as="button"
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
      <UModal v-if="!authUserId" title="Sign up" v-model:open="showSignup">
        <UButton class="mx-auto" size="md" label="Sign up" color="primary" variant="ghost" />
        <template #body>
          <div class="flex justify-center">
            <SignupFrom
              @signup="(router.push({ name: 'Welcome' }), (showSignup = false))"
              class="h-100 m-2"
            />
          </div>
        </template>
      </UModal>
      <UPopover v-if="authUserId">
        <UButton class="mx-auto" size="lg" label="Sign Out" color="primary" variant="ghost" />
        <template #content>
          <div class="size-44 m-6 flex flex-1 flex-col justify-around p-2">
            <div class="text-bold text-4xl text-justify-center">Are you sure?</div>
            <UButton icon="i-lucide-log-out" class="w-full" size="xl" @click="signOut"
              >Sign out</UButton
            >
          </div>
        </template>
      </UPopover>
    </div>
    <div class="mb-4"><ColorButton></ColorButton> <Onboarding></Onboarding></div>
    <USeparator orientation="vertical" class="fixed ml-40"></USeparator>
  </div>
</template>
<style scoped></style>
