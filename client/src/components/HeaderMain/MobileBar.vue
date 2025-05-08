<script setup lang="ts">
import { authUserId, logout } from '@/user'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { DropdownMenuItem } from '@nuxt/ui'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const items = computed<DropdownMenuItem[]>(
  () =>
    [
      { label: 'Home', icon: 'i-lucide-house', onSelect: () => router.push({ name: 'Home' }) },
      authUserId.value && {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        onSelect: () => router.push({ name: 'Dashboard' }),
      },
      {
        label: 'About',
        icon: 'i-lucide-circle-help',
        onSelect: () => {
          router.push({ name: 'About' })
        },
      },
      authUserId.value && {
        type: 'separator' as const,
      },
      authUserId.value && {
        label: 'Profile',
        icon: 'i-lucide-user',
        onSelect: () => {
          toast.add({
            title: 'Alert',
            description: 'Feature not yet implemented',
            color: 'warning',
          })
        },
      },
      authUserId.value && {
        label: 'Settings',
        icon: 'i-lucide-cog',
        onSelect: () => {
          toast.add({
            title: 'Alert',
            description: 'Feature not yet implemented',
            color: 'warning',
          })
        },
      },
      {
        type: 'separator' as const,
      },
      authUserId.value && {
        label: 'Sign out',
        icon: 'i-lucide-log-out',
        onSelect: () => {
          logout()
          router.push({ name: 'Sign In' })
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
    class="bg-background-primary dark:bg-neutral-900 h-20 bg-white md:hidden fixed top-0 left-0 w-full z-50"
  >
    <div class="p-4 z-[50] flex justify-between mb-2">
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
