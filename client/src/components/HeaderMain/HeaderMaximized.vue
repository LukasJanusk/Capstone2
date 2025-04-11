<script lang="ts" setup>
import { authUserId } from '@/user'
</script>
<template>
  <header>
    <nav>
      <button v-if="!authUserId" @click="$emit('signup')">Sign up</button>
      <button v-if="!authUserId" @click="$emit('signin')">Sign in</button>
      <button v-if="authUserId" @click="$emit('signout')">Sign out</button>
      <button v-if="authUserId" @click="$emit('dashboard')">Dashboard</button>
    </nav>
    <img
      class="arrows left"
      src="../../assets/left.png"
      alt="collapse-button"
      @click="$emit('toggle')"
      title="collapse"
    />
  </header>
</template>
<style lang="css" scoped>
header {
  background: linear-gradient(to right, rgb(4, 4, 71), rgba(11, 11, 104, 0.9));
  box-shadow: 7 10 5 rgb(1, 1, 1);
  height: 100%;
  position: fixed;
  padding: 10px;
  top: 0;
  left: 0;
  padding-bottom: 40px;
  width: 120px;
  border-right: 2px solid rgb(3, 0, 21);
}
.arrows {
  position: fixed;
  border-radius: 15px;
  background: rgba(133, 134, 134, 0.256);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 10;
}
.arrows:hover {
  background: rgba(133, 134, 134, 0.8);
}
.left {
  left: 110px;
}
nav {
  display: flex;
  flex-direction: column;
}
button {
  margin: 2px;
}
</style>
