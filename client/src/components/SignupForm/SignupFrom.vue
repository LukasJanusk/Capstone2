<script setup lang="ts">
import { signup } from '../../user'
import { schema } from '../../user/schema'
import { onMounted, ref } from 'vue'
import { getTraits } from '../../traits'
import type { TraitPublic } from '@server/shared/trpc'
import { setError, resetError, parseErrorMessage } from '../../errors/index'

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
  <UForm class="max-w-xs w-xs mx-auto p-4" @submit="signUp" :state="userData" :schema="schema">
    <UFormField size="lg" label="First Name" name="firstName" required>
      <UInput class="w-full" v-model="userData.firstName"></UInput>
    </UFormField>
    <UFormField size="lg" label="Last Name" name="lastName" required>
      <UInput class="w-full" v-model="userData.lastName"></UInput>
    </UFormField>
    <UFormField size="lg" label="Email" name="email" required>
      <UInput class="w-full" v-model="userData.email" />
    </UFormField>
    <UFormField size="lg" label="Password" name="password" required>
      <UInput class="w-full" v-model="userData.password" type="password" />
    </UFormField>
    <UFormField label="Traits" name="traits" required>
      <UInputMenu
        class="w-full"
        placeholder="Select 3 or more traits"
        v-model="userData.traits"
        size="lg"
        multiple
        label-key="name"
        :items="traits"
        :loading="traits.length < 1"
      />
    </UFormField>
    <UButton
      loading-auto
      class="mt-4 mb-4 w-full h-12"
      trailing-icon="i-lucide-arrow-right"
      type="submit"
      >Submit</UButton
    >
  </UForm>
</template>
