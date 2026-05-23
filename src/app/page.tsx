// Revalida a home a cada 5 minutos em vez de gerar estaticamente
export const revalidate = 300

import AnnouncementList from "@/components/AnnouncementList"
import { CarouselHome } from "@/components/CarouselHome"
import { CarouselHomeMobile } from "@/components/CarouselHomeMobile"
import Navbar from "@/components/Navbar"
import { HomeTabs } from "@/components/HomeTabs"
import { StatsStrip } from "@/components/StatsStrip"
import { ExpiringOffers } from "@/components/ExpiringOffers"
import { WhatsAppFloat } from "@/components/WhatsAppFloat"

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Banner — verdadeiramente full-width, sem padding */}
      <div className="w-full overflow-hidden">
        <div className="md:hidden">
          <CarouselHomeMobile />
        </div>
        <div className="hidden md:block">
          <CarouselHome />
        </div>
      </div>

      {/* Barra de estatísticas (Cuponation-style) */}
      <StatsStrip />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8 flex flex-col gap-12">

        {/* Seção principal com tabs (Pelando-style) */}
        <section>
          <HomeTabs />
        </section>

        {/* Ofertas expirando em breve (urgência) */}
        <ExpiringOffers />

        {/* Sidebar de redes sociais — somente desktop */}
        <aside className="hidden lg:flex flex-col gap-4">
          <AnnouncementList />
        </aside>

      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40 mt-10 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} JCG Distribuidora</span>
          <span className="text-center text-xs">
            Este site usa links de afiliado do Mercado Livre — os preços são os mesmos para você.
          </span>
          <div className="flex gap-4 text-xs">
            <a href="/terms" className="hover:underline">Termos</a>
            <a href="/privacy" className="hover:underline">Privacidade</a>
          </div>
        </div>
      </footer>

      {/* Botão flutuante WhatsApp */}
      <WhatsAppFloat />
    </>
  )
}
