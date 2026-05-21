import AnnouncementList from "@/components/AnnouncementList"
import { CarouselHome } from "@/components/CarouselHome"
import { CarouselHomeMobile } from "@/components/CarouselHomeMobile"
import Navbar from "@/components/Navbar"
import ProductList from "@/components/ProductList"

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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8 flex flex-col gap-12">

        {/* Seção destaques */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 bg-primary rounded-full" />
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-extrabold uppercase tracking-wide">
              Destaques
            </h2>
            <div className="flex-1 h-px bg-border ml-1" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <ProductList limit={10} grid />
          </div>
        </section>

        {/* Seção mais vendidos + sidebar */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 bg-yellow-400 rounded-full" />
            <span className="text-2xl">⭐</span>
            <h2 className="text-xl font-extrabold uppercase tracking-wide">
              Mais Vendidos
            </h2>
            <div className="flex-1 h-px bg-border ml-1" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
              <ProductList limit={8} grid offset={10} />
            </div>
            {/* Sidebar de redes sociais — somente desktop */}
            <aside className="hidden lg:flex flex-col w-60 shrink-0 gap-4">
              <AnnouncementList />
            </aside>
          </div>
        </section>

        {/* Seção novidades */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 bg-green-500 rounded-full" />
            <span className="text-2xl">🆕</span>
            <h2 className="text-xl font-extrabold uppercase tracking-wide">
              Novidades do Mês
            </h2>
            <div className="flex-1 h-px bg-border ml-1" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <ProductList limit={10} grid offset={18} />
          </div>
        </section>

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
    </>
  )
}
