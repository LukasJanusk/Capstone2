<script setup lang="ts">
import { signup } from '../../user'
import { onMounted, ref } from 'vue'
import { getTraits } from '../../traits'
import type { TraitPublic } from '@server/shared/trpc'
import ErrorBox from '@/components/ErrorBox.vue'
import { errorMessage, error, setError, resetError, parseErrorMessage } from '../../errors/index'

const traits = ref<TraitPublic[]>([])
const emit = defineEmits<{ (event: 'signup', user: any): void }>()
const isMobileOS = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
)

const userData = ref({
  firstName: '',
  lastName: '',
  password: '',
  email: '',
  traits: [] as TraitPublic[],
})
const addTrait = () => {
  if (selectedTrait.value && !userData.value.traits.includes(selectedTrait.value)) {
    userData.value.traits.push(selectedTrait.value)
    selectedTrait.value = null
  }
}
const selectedTrait = ref<TraitPublic | null>(null)
const signUp = async () => {
  try {
    const user = await signup(userData.value)
    if (!user) {
      setError('Something went wrong signing up, please try again later')
      return
    }
    resetError()
    emit('signup', user)
  } catch (err) {
    setError(parseErrorMessage(err))
    return
  }
}
onMounted(async () => {
  try {
    traits.value = await getTraits()
  } catch (err) {
    setError(parseErrorMessage(err))
    return
  }
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
      <label for="traits" title="Select 3 or more traits that defines you the best">Traits*</label>

      <div id="selected-traits">
        <div
          @click="userData.traits = userData.traits.filter((t) => t.id !== trait.id)"
          v-for="trait in userData.traits"
          :key="trait.id"
          class="trait-tag"
        >
          {{ trait.name }} ❌
        </div>
      </div>
      <select
        multiple
        v-if="!isMobileOS"
        v-model="selectedTrait"
        @change="!isMobileOS ? addTrait : () => {}"
      >
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
      <select v-if="isMobileOS" v-model="selectedTrait" @change="addTrait">
        <option
          v-for="trait in traits"
          :key="trait.id"
          :disabled="userData.traits.includes(trait)"
          :value="trait"
        >
          {{ trait.name }}
        </option>
      </select>

      <button type="submit">Sign Up</button>
    </form>
  </div>
  <ErrorBox v-if="error" :message="errorMessage" @close="resetError"></ErrorBox>
</template>
<style lang="css" scoped>
form {
  display: flex;
  max-width: 200px;
  flex-direction: column;
  padding: 2px;
}
#selected-traits {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 100%;
  text-align: start;
}
label {
  margin-top: 10px;
}
button {
  margin: 5px;
  margin-top: 10px;
}
</style>
