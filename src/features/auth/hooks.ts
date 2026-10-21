import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, logout, signup } from './api'
import { sessionStore } from './session'

// Dados privados ficam sob a chave ['user', ...]; ao trocar de sessão eles são descartados.
export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      qc.removeQueries({ queryKey: ['user'] })
      sessionStore.set(res)
    },
  })
}

export function useSignup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: signup,
    onSuccess: (res) => {
      qc.removeQueries({ queryKey: ['user'] })
      sessionStore.set(res)
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logout,
    // mesmo que a API falhe, a sessão local é encerrada
    onSettled: () => {
      sessionStore.clear()
      qc.removeQueries({ queryKey: ['user'] })
    },
  })
}