import { ref } from 'vue'
import { ZodError } from 'zod'

export const errorMessage = ref('')
export const error = ref<boolean>(false)

export const resetError = () => {
  errorMessage.value = ''
  error.value = false
}
export const setError = (message: string) => {
  errorMessage.value = message
  error.value = true
}

export const parseErrorMessage = (error: unknown) => {
  if (error instanceof ZodError) {
    const msg = error.errors.map((err) => `${err.path[0]}: ${err.message}`)
    return msg[0] || 'Unknown error occurred'
  } else if (error instanceof Error) {
    return error.message || 'Unknown error occurred'
  } else {
    return 'Unknown error occurred'
  }
}
