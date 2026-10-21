import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { ChevronLeft, Heart } from 'lucide-react'

// Voltar + favoritar sobre a imagem do NFT, só no celular.
// Coloque dentro do contêiner da imagem (que precisa ter "relative").
export function DetailTopBar() {
  const router = useRouter()
  const [fav, setFav] = useState(false)
  const btn = 'grid size-9 place-items-center rounded-full bg-background/60 text-brand backdrop-blur outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex justify-between p-3 md:hidden">
      <button type="button" onClick={() => router.history.back()} aria-label="Voltar" className={btn}>
        <ChevronLeft className="size-5" />
      </button>
      <button type="button" aria-pressed={fav} onClick={() => setFav((f) => !f)} aria-label="Favoritar" className={btn}>
        <Heart className={`size-4 ${fav ? 'fill-brand' : ''}`} />
      </button>
    </div>
  )
}
