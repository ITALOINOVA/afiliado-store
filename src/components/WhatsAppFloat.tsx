"use client"
import useStoreInfo from "@/hooks/useStore"

export function WhatsAppFloat() {
  const storeInfo = useStoreInfo()
  const phone = storeInfo?.storeContact?.socialWhatsApp

  // Só mostra se o número de WhatsApp estiver configurado na loja
  if (!phone) return null

  const clean = phone.replace(/\D/g, "")
  const href  = `https://wa.me/${clean}?text=${encodeURIComponent("Olá! Quero receber as melhores ofertas! 🛍️")}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 group"
      aria-label="Falar no WhatsApp"
    >
      {/* Ícone WhatsApp */}
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.136 1.533 5.875L0 24l6.305-1.51A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.017-1.374l-.36-.214-3.732.894.944-3.641-.234-.375A9.818 9.818 0 1 1 12 21.818z"/>
      </svg>
      <span className="hidden sm:inline">Receber ofertas</span>
    </a>
  )
}
