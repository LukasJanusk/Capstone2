<script setup lang="ts"></script>
<template>
  <Header>
    <div>
      <button @click="$emit('signup')">Sign up</button>
      <button @click="$emit('signin')">Sign in</button>
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
