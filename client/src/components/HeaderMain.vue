<script setup lang="ts">
import { authUserId } from '../user'
</script>

<template>
  <Header>
    <div>
      <button @click="$emit('signup')">Sign up</button>
      <button v-if="!authUserId" @click="$emit('signin')">Sign in</button>
      <button v-if="authUserId" @click="$emit('signout')">Sign out</button>
    </div>
  </Header>
</template>

<style lang="css" scoped>
Header {
  position: relative;
  padding-bottom: 40px;
}
button {
  margin: 2px;
}
</style>
