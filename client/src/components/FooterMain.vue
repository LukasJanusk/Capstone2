<script lang="ts" setup></script>
<template>
  <footer></footer>
</template>
<style lang="css" scoped>
@media (width <= 600px) {
  footer {
    visibility: visible;
    background: linear-gradient(to right, rgba(11, 11, 104, 0.9), rgb(4, 4, 71));
    box-shadow: 5 10 5 rgb(1, 1, 1);
    height: 100%;
    position: fixed;
    padding: 10px;
    top: 0;
    right: 0;
    padding-bottom: 40px;
    width: 20px;
    border-left: 2px solid rgb(3, 0, 21);
    z-index: 100;
  }
}
@media (width >= 600px) {
  footer {
    visibility: hidden;
  }
}
@media (prefers-color-scheme: light) {
  footer {
    background: linear-gradient(to left, rgb(32, 32, 254), rgb(36, 36, 248));
    border-left: 2px solid rgb(0, 34, 255);
  }
}
</style>
