import { useState } from 'react'

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0)
  const current = images[index] ?? images[0]

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
        <img
          src={current}
          alt={`${name}, imagem ${index + 1} de ${images.length}`}
          width={600}
          height={600}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <ul className="flex gap-2" aria-label="Imagens do NFT">
          {images.map((src, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver imagem ${i + 1}`}
                aria-pressed={i === index}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  i === index ? 'border-foreground' : 'border-transparent'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}