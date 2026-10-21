import { useMemo } from "react";
import { buildNfts } from "@/mocks/fixtures/nfts";
import type { Nft } from "@/contracts";

type Props = {
  title?: string;
  className?: string;
  items?: Nft[]; // opcional: se não vier, usa as fixtures
};

export function NftCarousel({ title, className = "", items }: Props) {
  // buildNfts() roda uma vez, não a cada render
  const list = useMemo(() => items ?? buildNfts().slice(0, 8), [items]);

  return (
    <section className={className}>
      {title && <h2 className="mb-4 text-xl">{title}</h2>}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {list.map((nft) => (
          <article key={nft.id} className="w-48 shrink-0">
            <img
              src={nft.image}
              alt={nft.name}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <p className="mt-2 truncate">{nft.name}</p>
            <p className="text-sm opacity-80">{nft.price} ETH</p>
          </article>
        ))}
      </div>
    </section>
  );
}