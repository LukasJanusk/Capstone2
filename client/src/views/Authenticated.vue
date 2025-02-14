<script setup lang="ts">
import { ref, onMounted } from 'vue'

const authCode = ref('')
const accessGranter = ref(false)
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (code) {
    authCode.value = code
    // send request to back and to get user access from strava
    const access = await router.strava.getAccess({ code })
  }
})
</script>

<template>
  <div><h2>Thank you for choosing us!</h2></div>
  <div v-if="authCode"><h3>Code received</h3></div>
  <div v-if="accessGranter"><h3>Access granted!</h3></div>
</template>

<style scoped></style>
