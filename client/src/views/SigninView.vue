<script setup lang="ts">
import { ref } from 'vue'
import { signin } from '../user'
import router from '../router'

const userData = ref({ email: '', password: '' })

const signIn = async () => {
  await signin(userData.value)
  router.push({ name: 'Home' })
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
