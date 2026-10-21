const banners = [
  { title: 'Lançamentos gênesis de edição limitada', text: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.', image: '/nfts/emerald-ape-042.png' },
  { title: 'Arte digital selecionada e muito mais', text: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.', image: '/nfts/ivory-baron-088.png' },
]

function scrollToCatalog() {
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
}

export function HomeBanners() {
  return (
    <section aria-label="Destaques da Kurio" className="mt-16 grid gap-6 md:grid-cols-2">
      {banners.map((b) => (
        <article key={b.title} className="grid grid-cols-[40%_1fr] items-stretch overflow-hidden bg-card">
          <img src={b.image} alt="" loading="lazy" className="size-full min-h-40 object-cover" />
          <div className="flex flex-col justify-center gap-2 p-4 text-right">
            <h2 className="font-bold leading-snug">{b.title}</h2>
            <p className="text-xs text-muted-foreground md:text-sm">{b.text}</p>
            <div>
              <button type="button" onClick={scrollToCatalog} className="mt-1 bg-secondary px-4 py-1.5 text-sm font-bold text-brand outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Explorar →
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
