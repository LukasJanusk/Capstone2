<script lang="ts" setup>
import { authUserId, logout } from '@/user'
import SignInForm from '../SignInForm.vue'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { DropdownMenuItem } from '@nuxt/ui'

const router = useRouter()
const route = useRoute()
const items = computed<DropdownMenuItem[]>(
  () =>
    [
      { label: 'Home', icon: 'i-lucide-house', onSelect: () => router.push({ name: 'Home' }) },
      authUserId.value && {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        onSelect: () => router.push({ name: 'Dashboard' }),
      },
      authUserId.value && { label: 'Profile', icon: 'i-lucide-user' },
      authUserId.value && { label: 'Settings', icon: 'i-lucide-cog' },
      authUserId.value && {
        label: 'Sign out',
        icon: 'i-lucide-log-out',
        onSelect: () => {
          logout()
          router.push({ name: 'Home' })
        },
      },
      !authUserId.value && {
        label: 'Sign in',
        icon: 'i-lucide-log-in',
        onSelect: () => router.push({ name: 'Sign In' }),
      },
      !authUserId.value && {
        label: 'Sign up',
        icon: 'i-lucide-badge-plus',
        onSelect: () => router.push({ name: 'Sign Up' }),
      },
    ].filter(Boolean) as DropdownMenuItem[]
)
</script>
<template>
  <div
    class="fixed left-0 top-0 h-screen w-[200px] min-w-40 max-md:hidden flex flex-col gap-4 overflow-y-auto bg-background-primary text-foreground-primary border-r border-border-secondary"
  >
    <span class="font-bold text-xl mt-6">{{ route.name ? route.name : 'Menu' }}</span>
    <div class="m-1 gap-1 mt-auto flex flex-col">
      <UModal v-if="!authUserId" title="Sign in">
        <UButton size="lg" label="Sign in" color="primary" variant="subtle" />
        <template #body>
          <div class="flex justify-center">
            <SignInForm class="h-56 m-2" />
          </div>
        </template>
      </UModal>
      <UModal v-if="!authUserId" title="Sign up">
        <UButton size="sm" label="Sign up" color="primary" variant="subtle" />
        <template #body>
          <div class="flex justify-center">
            <SignupFrom class="h-100 m-2" />
          </div>
        </template>
      </UModal>
      <UModal v-if="authUserId" title="Are you sure?">
        <UButton size="lg" label="Sign Out" color="primary" variant="subtle" />
        <template #body>
          <UButton size="xl" @click="logout">Sign out</UButton>
        </template>
      </UModal>
    </div>
  </div>
  <div class="md:hidden fixed top-0 left-0 w-full">
    <div class="bg-background-primary p-4 z-[50] flex justify-between mb-2">
      <UDropdownMenu
        size="xl"
        class="z-[1000] justify-end flex"
        :items="items"
        :ui="{ content: 'z-[1000] w-48' }"
      >
        <UButton size="xl" icon="i-lucide-menu" color="neutral" variant="soft" />
      </UDropdownMenu>
      <span class="font-bold text-xl">{{ route.name ? route.name : 'Menu' }}</span>
      <ColorButton class=""></ColorButton>
    </div>
    <USeparator></USeparator>
  </div>
</template>
<style lang="css"></style>
