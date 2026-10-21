import { useState } from 'react'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SignupInputSchema, type SignupInput } from '@/contracts'
import { Button } from '@/components/ui/button'
import { Field, inputClass } from './components/Field'
import { applyApiError } from './form'
import { useSignup } from './hooks'
import { safeRedirect } from './search'

const route = getRouteApi('/signup')

export function SignupPage() {
  const search = route.useSearch()
  const router = useRouter()
  const signup = useSignup()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(SignupInputSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await signup.mutateAsync(values)
      router.history.push(safeRedirect(search.redirect))
    } catch (error) {
      setFormError(applyApiError(error, setError, ['name', 'email', 'password']))
    }
  })

  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Criar conta</h1>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field id="name" label="Nome" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClass}
            {...register('name')}
          />
        </Field>

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

        <Field id="password" label="Senha" error={errors.password?.message} hint="Mínimo de 8 caracteres.">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : 'password-hint'}
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
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <p className="text-center text-sm">
        Já tem conta?{' '}
        <Link to="/login" search={{ redirect: search.redirect }} className="underline">
          Entrar
        </Link>
      </p>
    </section>
  )
}

