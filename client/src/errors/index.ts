import { ref } from 'vue'
import { ZodError } from 'zod'

const toast = useToast()

export const errorMessage = ref('')

export const resetError = () => {
  errorMessage.value = ''
}
export const setError = (message: string) => {
  errorMessage.value = message

  toast.add({
    title: 'Error',
    description: errorMessage.value,
    color: 'error',
  })
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
