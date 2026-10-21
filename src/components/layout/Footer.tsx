import { useState } from 'react'

const benefits = [
  { letter: 'W', title: 'Segurança da carteira', text: 'Proteja sua carteira e colecione arte digital verificada com confiança.' },
  { letter: 'C', title: 'Criadores em destaque', text: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.' },
  { letter: 'D', title: 'Alertas de lançamentos', text: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.' },
]

const columns = [
  { title: 'Meu perfil', links: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'] },
  { title: 'Central de ajuda', links: ['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'] },
  { title: 'Coleções', links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'] },
]

function Newsletter() {
  const [sent, setSent] = useState(false)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <h2 className="font-bold leading-tight">Antecipe-se ao próximo lançamento</h2>
      <div className="mt-4 flex">
        <label htmlFor="news-email" className="sr-only">E-mail</label>
        <input
          id="news-email"
          type="email"
          required
          placeholder="digite seu e-mail..."
          className="min-w-0 flex-1 bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button type="submit" className="bg-primary px-4 font-bold text-primary-foreground">Enviar</button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground" role="status">
        {sent
          ? 'Pronto! Você vai receber os próximos lançamentos.'
          : 'Receba lançamentos selecionados, histórias de criadores e novidades do mercado.'}
      </p>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="mx-auto mb-20 mt-16 max-w-[1200px] px-4 md:mb-0 md:px-6">
      <section className="grid gap-8 bg-card p-6 md:grid-cols-4 md:p-8">
        {benefits.map((b) => (
          <div key={b.title} className="md:border-r md:border-brand/60 md:pr-6">
            <div className="grid size-14 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {b.letter}
            </div>
            <h2 className="mt-4 font-bold">{b.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
          </div>
        ))}
        <Newsletter />
      </section>

      <section className="grid gap-3 bg-secondary px-8 py-6 text-sm md:grid-cols-4 md:items-center">
        <strong className="text-xs tracking-widest">KURIO</strong>
        <p>Feito para colecionadores, criadores e cultura</p>
        <p>contato@email.com</p>
        <p>+55 11 4002 8922</p>
      </section>

      <section className="grid gap-8 bg-card p-8 sm:grid-cols-2 md:grid-cols-4">
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-lg font-bold">{c.title}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {c.links.map((l) => (
                <li key={l}>
                  <span className="cursor-default hover:text-brand">{l}</span>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="text-lg font-bold">Redes sociais</h2>
          <p className="mt-2 text-sm text-muted-foreground">Facebook · Instagram · X · LinkedIn · YouTube</p>
          <h2 className="mt-6 text-lg font-bold">Carteiras compatíveis</h2>
          <p className="mt-2 inline-block rounded border border-border px-2 py-1 text-[10px] font-bold text-brand">
            METAMASK · WALLETCONNECT · COINBASE
          </p>
        </div>
      </section>

      <p className="py-4 text-center text-xs">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  )
}
