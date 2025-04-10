<script setup lang="ts">
import { authUserId } from '../user'
</script>

<template>
  <header>
    <nav>
      <button v-if="!authUserId" @click="$emit('signup')">Sign up</button>
      <button v-if="!authUserId" @click="$emit('signin')">Sign in</button>
      <button v-if="authUserId" @click="$emit('signout')">Sign out</button>
      <button v-if="authUserId" @click="$emit('dashboard')">Dashboard</button>
    </nav>
  </header>
</template>

<style lang="css" scoped>
header {
  width: 120px;
  background-color: rgb(5, 5, 85);
  box-shadow: 5 10 5 rgb(1, 1, 1);
  height: 100%;
  position: fixed;
  padding: 10px;
  top: 1px;
  left: 1px;
  padding-bottom: 40px;
}
nav {
  display: flex;
  flex-direction: column;
}
button {
  margin: 2px;
}
</style>
