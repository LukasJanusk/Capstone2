<script setup lang="ts">
import { ref } from 'vue'
import { signin } from '../user'
import router from '../router'
import { parseErrorMessage, setError } from '@/errors'

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
  <UForm class="max-w-xs w-xs mx-auto p-4" @submit="signIn" :state="userData">
    <UFormField label="Email" name="email" required>
      <UInput size="lg" class="w-full" v-model="userData.email" />
    </UFormField>
    <UFormField label="Password" name="password" required>
      <UInput size="lg" class="w-full" v-model="userData.password" type="password" />
    </UFormField>
    <UButton
      loading-auto
      class="mt-4 mb-4 w-full h-12"
      trailing-icon="i-lucide-arrow-right"
      type="submit"
      >Sign in</UButton
    >
  </UForm>
</template>
