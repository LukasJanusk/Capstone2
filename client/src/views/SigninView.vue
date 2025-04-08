<script setup lang="ts">
import { ref } from 'vue'
import { signin } from '../user'
import router from '../router'
import { parseErrorMessage, setError, error, errorMessage, resetError } from '@/errors'
import ErrorBox from '@/components/ErrorBox.vue'

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
  <div class="main-container">
    <form @submit.prevent="signIn">
      <label for="email">Email</label>
      <input v-model="userData.email" type="email" required />
      <label for="password">Password</label>
      <input v-model="userData.password" type="password" required />
      <button type="submit">Sign in</button>
    </form>
  </div>
  <ErrorBox v-if="error" :message="errorMessage" @close="resetError"></ErrorBox>
</template>

<style lang="css" scoped>
form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
button {
  margin: 4px;
}
</style>
