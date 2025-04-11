<script setup lang="ts">
import { ref } from 'vue'
import { signin } from '../user'
import router from '../router'
import { parseErrorMessage, setError, errorMessage, resetError } from '@/errors'
import ErrorBox from '@/components/ErrorBox.vue'
import MainContainer from '@/components/MainContainer.vue'

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
  <MainContainer>
    <form @submit.prevent="signIn">
      <label for="email">Email</label>
      <input v-model="userData.email" type="email" required />
      <label for="password">Password</label>
      <input v-model="userData.password" type="password" required />
      <button type="submit">Sign in</button>
    </form>
  </MainContainer>
  <ErrorBox :message="errorMessage" @close="resetError"></ErrorBox>
</template>

<style lang="css" scoped>
form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
button {
  margin: 5px;
}
</style>
