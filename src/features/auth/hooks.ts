import { useMutation } from '@tanstack/react-query'
import { login, signup } from './api'
import { sessionStore } from './session'

export function useLogin() {
  return useMutation({ mutationFn: login, onSuccess: sessionStore.set })
}

export function useSignup() {
  return useMutation({ mutationFn: signup, onSuccess: sessionStore.set })
}