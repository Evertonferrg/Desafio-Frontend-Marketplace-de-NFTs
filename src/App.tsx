import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addEth, mulEth, formatEth } from '@/lib/money'
import { http } from '@/lib/http'
import type { ApiError } from '@/contracts'


const total = addEth(mulEth('0.1', 1), '0.2')

export default function App() {
  const [out, setOut] = useState('clique para testar a API simulada')

  async function testApi() {
    try {
      const { data } = await http.get('/nfts', { params: { q: 'neon', sort: 'price_asc' } })
      setOut(`${data.total} NFTs encontrados. Primeiro: ${data.items[0]?.name ?? '-'}`)
    } catch (e) {
      setOut(`Erro: ${(e as ApiError).code}`)
    }
  }

  return (
    <div className="flex flex-col items-start gap-4 p-8">
      <Button>{formatEth(total)}</Button>
      <Button variant="outline" onClick={testApi}>
        Testar /api/nfts
      </Button>
      <p className="text-sm">{out}</p>
    </div>
  )
}