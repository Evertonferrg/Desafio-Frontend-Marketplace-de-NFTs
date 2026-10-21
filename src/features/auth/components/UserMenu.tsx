import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { LoginIcon } from '@/components/icons'
import { useLogout } from '../hooks'
import { useSession } from '../session'

export function UserMenu() {
  const session = useSession()
  const router = useRouter()
  const logout = useLogout()

  if (!session) {
    return (
      <nav aria-label="Conta">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LoginIcon />
          Entrar
        </Link>
      </nav>
    )
  }

  return (
    <nav aria-label="Conta" className="flex items-center gap-3 text-sm">
      <Link to="/profile" className="max-w-32 truncate underline-offset-4 hover:underline">
        {session.session.user.name}
      </Link>
      <Button
        variant="outline"
        disabled={logout.isPending}
        onClick={() => logout.mutate(undefined, { onSettled: () => void router.navigate({ to: '/' }) })}
      >
        Sair
      </Button>
    </nav>
  )
}