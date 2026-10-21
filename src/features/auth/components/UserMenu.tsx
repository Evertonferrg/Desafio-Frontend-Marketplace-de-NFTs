import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useLogout } from '../hooks'
import { useSession } from '../session'

export function UserMenu() {
  const session = useSession()
  const router = useRouter()
  const logout = useLogout()

  if (!session) {
    return (
      <nav aria-label="Conta" className="flex items-center gap-4 text-sm">
        <Link to="/login" className="underline">
          Entrar
        </Link>
        <Link to="/signup" className="underline">
          Criar conta
        </Link>
      </nav>
    )
  }

  return (
    <nav aria-label="Conta" className="flex items-center gap-4 text-sm">
      <Link to="/profile" className="underline">
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
