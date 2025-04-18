<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderMain from './components/HeaderMain/HeaderMain.vue'
import FooterMain from './components/FooterMain.vue'
import router from './router'
import { logout } from './user'
</script>

<template>
  <HeaderMain
    @signup="router.push({ name: 'SignUp' })"
    @signin="router.push({ name: 'SignIn' })"
    @signout="(logout(), router.push({ name: 'SignIn' }))"
    @dashboard="router.push({ name: 'Dashboard' })"
  ></HeaderMain>
  <RouterView />
  <FooterMain></FooterMain>
</template>
