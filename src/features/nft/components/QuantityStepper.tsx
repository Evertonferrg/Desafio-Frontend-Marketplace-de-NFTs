import { Button } from '@/components/ui/button'

type Props = { value: number; min?: number; max: number; onChange: (value: number) => void }

export function QuantityStepper({ value, min = 1, max, onChange }: Props) {
  return (
    <div role="group" aria-label="Quantidade" className="inline-flex items-center gap-1 rounded-lg border p-1">
      <Button
        type="button"
        variant="ghost"
        aria-label="Diminuir quantidade"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </Button>
      <span className="w-8 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        aria-label="Aumentar quantidade"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  )
}