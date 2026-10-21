import { AuthResponseSchema, type LoginInput, type SignupInput } from '@/contracts'
import { http } from '@/lib/http'

export async function login(input: LoginInput) {
  const { data } = await http.post('/auth/login', input)
  return AuthResponseSchema.parse(data)
}

export async function signup(input: SignupInput) {
  const { data } = await http.post('/auth/signup', input)
  return AuthResponseSchema.parse(data)
}

export async function logout() {
  await http.post('/auth/logout')
}