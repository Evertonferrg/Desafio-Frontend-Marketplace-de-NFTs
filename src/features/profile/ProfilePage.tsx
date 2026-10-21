import { useEffect, useRef, useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { EnsField, Field, PasswordField, primaryButton } from '@/components/ui/form'

export function ProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // libera a URL temporária da imagem escolhida
  useEffect(() => () => { if (avatar) URL.revokeObjectURL(avatar) }, [avatar])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: enviar os dados para a API
    setSaved(true)
  }

  return (
    <form onSubmit={onSubmit} className="max-w-[862px]">
      <h1 className="font-bold">Perfil do colecionador</h1>

      <div className="mt-6 grid gap-x-6 gap-y-5 md:grid-cols-2">
        <Field id="displayName" label="Nome de exibição" required />
        <Field id="username" label="Nome de usuário" required />
        <Field id="email" label="E-mail" type="email" required />
        <EnsField id="ens" />
        <Field id="walletNick" label="Apelido da carteira" required />

        <div>
          <p className="text-sm">Avatar</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="grid size-12 place-items-center overflow-hidden rounded-full bg-card text-brand">
              {avatar ? <img src={avatar} alt="Seu avatar" className="size-full object-cover" /> : <ImageIcon className="size-5" />}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setAvatar(URL.createObjectURL(f))
              }}
            />
            <button type="button" onClick={() => fileRef.current?.click()} className={primaryButton}>Alterar</button>
            <button type="button" onClick={() => setAvatar(null)} className="text-sm outline-none hover:text-brand focus-visible:ring-2 focus-visible:ring-ring">
              Remover
            </button>
          </div>
        </div>
      </div>

      <h2 className="mb-4 mt-10 font-bold">Alterar senha</h2>
      <div className="max-w-[417px] space-y-5">
        <PasswordField id="currentPassword" label="Senha atual" />
        <PasswordField id="newPassword" label="Nova senha" />
        <PasswordField id="confirmPassword" label="Confirmar nova senha" />
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button type="submit" className={primaryButton}>Salvar</button>
        <p role="status" className="text-sm text-brand">{saved ? 'Alterações salvas.' : ''}</p>
      </div>
    </form>
  )
}
