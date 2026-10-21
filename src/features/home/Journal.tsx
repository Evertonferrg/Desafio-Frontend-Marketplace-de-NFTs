const posts = [
  { date: '12 de setembro', read: 6, title: 'Como funciona a propriedade de NFTs', text: 'Aprenda a colecionar, negociar e verificar ativos digitais.', image: '/nfts/ivory-baron-088.png' },
  { date: '13 de setembro', read: 2, title: '10 artistas digitais para acompanhar', text: 'Conheça criadores que moldam a cultura digital.', image: '/nfts/emerald-ape-042.png' },
  { date: '15 de setembro', read: 3, title: 'Raridade, atributos e procedência', text: 'Entenda raridade, procedência, direitos autorais e utilidade.', image: '/nfts/violet-nomad-314.png' },
  { date: '15 de setembro', read: 2, title: 'Como proteger sua carteira', text: 'Proteja sua carteira, seus ativos e sua identidade.', image: '/nfts/golden-beat-207.png' },
]

export function Journal() {
  return (
    <section aria-labelledby="journal" className="mt-16">
      <h2 id="journal" className="text-center text-2xl font-bold">Diário da Cunhagem</h2>
      <p className="mt-2 text-center text-xs text-brand md:text-sm">
        Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {posts.map((p) => (
          <li key={p.title} className="flex flex-col overflow-hidden bg-card">
            <img src={p.image} alt="" loading="lazy" className="aspect-[1.35] w-full object-cover" />
            <div className="flex flex-1 flex-col gap-2 p-3">
              <p className="text-[11px] text-muted-foreground">{p.date} &nbsp;|&nbsp; Leitura de {p.read} min</p>
              <h3 className="text-sm font-bold leading-snug">{p.title}</h3>
              <p className="text-xs text-muted-foreground">{p.text}</p>
              <span className="mt-auto pt-1 text-xs font-bold text-brand">Ler mais →</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
