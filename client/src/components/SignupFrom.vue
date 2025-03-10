<script setup lang="ts">
import { signup } from '../user'
import { onMounted, ref, defineEmits } from 'vue'
import { getTraits } from '../traits'
import type { TraitPublic } from '@server/shared/trpc'

const traits = ref<TraitPublic[]>([])
const emit = defineEmits<{ (event: 'signup', user: any): void }>()

const userData = ref({
  firstName: '',
  lastName: '',
  password: '',
  email: '',
  traits: [] as TraitPublic[],
})

const signUp = async () => {
  const user = await signup(userData.value)
  if (user) emit('signup', user)
}
onMounted(async () => {
  traits.value = await getTraits()
  // should throw an error if no traits were loaded
})
</script>

<template>
  <div class="main-container">
    <form @submit.prevent="signUp">
      <label for="first_name">First name*</label>
      <input id="first_name" required v-model="userData.firstName" />
      <label for="last_name">Last name*</label>
      <input id="last_name" required v-model="userData.lastName" />
      <label for="email">Email*</label>
      <input id="email" type="email" required v-model="userData.email" />
      <label for="password">Password*</label>
      <input id="password" type="password" v-model="userData.password" />
      <label for="traits">Traits*</label>

      <div id="selected-traits">
        <span
          @click="userData.traits = userData.traits.filter((t) => t.id !== trait.id)"
          v-for="trait in userData.traits"
          :key="trait.id"
          class="trait-tag"
        >
          | {{ trait.name }} ❌ |
        </span>
      </div>

      <select multiple>
        <option
          @click="userData.traits.push(trait)"
          v-for="trait in traits"
          :key="trait.id"
          :hidden="userData.traits.includes(trait)"
          :disabled="userData.traits.includes(trait)"
          :value="trait"
        >
          {{ trait.name }}
        </option>
      </select>

      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>
<style lang="css" scoped>
form {
  display: flex;
  max-width: 200px;
  flex-direction: column;
  padding: 2px;
}
#selected-traits {
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
}
button {
  margin: 5px;
}
</style>
