<script setup lang="ts">
import { ref } from 'vue'
import { authUserId } from '../user'

const focused = ref<boolean>(true)
const toggle = () => (focused.value = !focused.value)
</script>

<template>
  <Transition>
    <header class="focused" v-if="!focused">
      <nav>
        <button v-if="!authUserId" @click="$emit('signup')">Sign up</button>
        <button v-if="!authUserId" @click="$emit('signin')">Sign in</button>
        <button v-if="authUserId" @click="$emit('signout')">Sign out</button>
        <button v-if="authUserId" @click="$emit('dashboard')">Dashboard</button>
      </nav>
      <img
        class="arrows left"
        src="../assets/left.png"
        alt="collapse-button"
        @click="toggle"
        title="collapse"
      />
    </header>
    <header class="minimized" v-else-if="focused">
      <img
        class="arrows right"
        src="../assets/right.png"
        alt="expand-button"
        @click="toggle"
        title="expand"
      />
    </header>
  </Transition>
</template>

<style lang="css" scoped>
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
.right {
  left: 10px;
}
header {
  background-color: rgb(5, 5, 85);
  box-shadow: 5 10 5 rgb(1, 1, 1);
  height: 100%;
  position: fixed;
  padding: 10px;
  top: 1px;
  left: 1px;
  padding-bottom: 40px;
}
.focused {
  width: 120px;
}
.minimized {
  width: 20px;
}
nav {
  display: flex;
  flex-direction: column;
}
button {
  margin: 2px;
}
</style>
