import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">KURIO</Link>

        <nav className="header__nav">
          <Link to="/" activeProps={{ className: 'active' }}>Início</Link>
          <Link to="/" activeProps={{ className: 'active' }}>Mercado</Link>
          <Link to="/" activeProps={{ className: 'active' }}>Criadores</Link>
          <Link to="/" activeProps={{ className: 'active' }}>Aprenda</Link>
        </nav>

        <div className="header__actions">
          <button aria-label="Buscar">🔍</button>
          <button aria-label="Carrinho">🛒</button>
          <button className="btn">Entrar</button>
        </div>
      </div>
    </header>
  )
}