import { useRouterState } from '@tanstack/react-router'

// Telas do celular que não mostram barra inferior nem rodapé (carrinho, pagamento, detalhes, login, cadastro).
export function useFocusedFlow() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  return path.startsWith('/nft/') || ['/cart', '/payment', '/login', '/signup'].includes(path)
}
