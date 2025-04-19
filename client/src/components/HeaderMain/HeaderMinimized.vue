<script lang="ts" setup></script>
<template>
  <header>
    <img
      class="arrows right"
      src="../../assets/right.png"
      alt="expand-button"
      @click="$emit('toggle')"
      title="expand"
    />
  </header>
</template>
<style lang="css" scoped>
header {
  background: linear-gradient(to right, rgb(4, 4, 71), rgba(11, 11, 104, 0.9));
  box-shadow: 5 10 5 rgb(1, 1, 1);
  height: 100%;
  position: fixed;
  padding: 10px;
  top: 0;
  left: 0;
  padding-bottom: 40px;
  width: 20px;
  border-right: 2px solid rgb(3, 0, 21);
  z-index: 100;
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
.right {
  left: 10px;
}
@media (prefers-color-scheme: light) {
  header {
    background: linear-gradient(to right, rgb(32, 32, 254), rgb(36, 36, 248));
    border-right: 2px solid rgb(0, 34, 255);
  }
  .arrows:hover {
    background: rgba(219, 219, 219, 0.8);
  }
}
</style>
