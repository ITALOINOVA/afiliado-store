"use client"
import * as React from "react"

const OFFER_DURATION_MS = 48 * 60 * 60 * 1000 // 48h

/** Mostra um countdown regressivo até o fim da oferta.
 *  A oferta dura 48h a partir do updatedAt do produto.
 *  Se já expirou, não renderiza nada.
 */
export function OfferTimer({ updatedAt }: { updatedAt: string }) {
  const getRemaining = React.useCallback(() => {
    const expiry = new Date(updatedAt).getTime() + OFFER_DURATION_MS
    return Math.max(0, expiry - Date.now())
  }, [updatedAt])

  const [remaining, setRemaining] = React.useState<number>(getRemaining)

  React.useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => {
      const r = getRemaining()
      setRemaining(r)
      if (r <= 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [getRemaining, remaining])

  if (remaining <= 0) return null

  const totalSec = Math.floor(remaining / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <p className="text-[10px] sm:text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md w-fit">
      ⏰ Oferta acaba em {pad(h)}:{pad(m)}:{pad(s)}
    </p>
  )
}
