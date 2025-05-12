<script setup lang="ts">
import { ref } from 'vue'
import { signin } from '../user'
import router from '../router'
import { parseErrorMessage, setError } from '@/errors'
import { signInSchema } from '@/user/schema'

const userData = ref({ email: '', password: '' })
const signIn = async () => {
  try {
    await signin(userData.value)
    router.push({ name: 'Home' })
  } catch (err) {
    setError(parseErrorMessage(err))
    return
  }
}
</script>
<template>
  <UForm
    class="md:max-w-sm md:w-sm mx-auto p-2 max-w-xs w-xs"
    @submit="signIn"
    :state="userData"
    :schema="signInSchema"
  >
    <UFormField label="Email" name="email" required>
      <UInput size="lg" class="w-full" v-model="userData.email" name="email" />
    </UFormField>
    <UFormField label="Password" name="password" required>
      <UInput
        size="lg"
        class="w-full"
        v-model="userData.password"
        type="password"
        name="password"
      />
    </UFormField>
    <USeparator class="mt-4"></USeparator>
    <UButton
      loading-auto
      class="mt-4 mb-4 w-full h-12"
      trailing-icon="i-lucide-arrow-right"
      type="submit"
      >Sign in</UButton
    >
  </UForm>
</template>
