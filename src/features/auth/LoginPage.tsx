import { useState } from 'react'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoginInputSchema, type LoginInput } from '@/contracts'
import { Button } from '@/components/ui/button'
import { Field, inputClass } from './components/Field'
import { applyApiError } from './form'
import { useLogin } from './hooks'
import { safeRedirect } from './search'

const route = getRouteApi('/login')

export function LoginPage() {
  const search = route.useSearch()
  const router = useRouter()
  const login = useLogin()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginInputSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login.mutateAsync(values)
      router.history.push(safeRedirect(search.redirect))
    } catch (error) {
      setFormError(applyApiError(error, setError, ['email', 'password']))
    }
  })

  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Entrar</h1>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field id="email" label="E-mail" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputClass}
            {...register('email')}
          />
        </Field>

        <Field id="password" label="Senha" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={inputClass}
            {...register('password')}
          />
        </Field>

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className="text-center text-sm">
        Não tem conta?{' '}
        <Link to="/signup" search={{ redirect: search.redirect }} className="underline">
          Criar conta
        </Link>
      </p>
    </section>
  )
}