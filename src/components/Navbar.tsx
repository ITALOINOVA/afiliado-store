"use client"
import Link from "next/link"
import React from "react"
import { ModeToggle } from "./ModeToggle"
import Search from "./Search"
import useStoreInfo from "@/hooks/useStore"

const CATEGORIES = [
  { icon: "📡", label: "Receptores",        href: "/search?q=receptor" },
  { icon: "🔵", label: "LNBFs / LNBs",      href: "/search?q=lnbf" },
  { icon: "📶", label: "Antenas",            href: "/search?q=antena" },
  { icon: "📺", label: "Smart TV Box",       href: "/search?q=smart+tv" },
  { icon: "🎧", label: "Áudio & Fones",      href: "/search?q=fone" },
  { icon: "🔌", label: "Cabos",              href: "/search?q=cabo" },
  { icon: "📦", label: "Atacado",            href: "/search?q=kit" },
  { icon: "🔥", label: "Mais Quentes",       href: "/search?q=" },
]

const Navbar = () => {
  const storeInfo = useStoreInfo()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Linha principal */}
      <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          {storeInfo?.storeLogo ? (
            <img
              src={storeInfo.storeLogo}
              alt={storeInfo.storeName}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-lg font-extrabold text-primary tracking-tight">
              {storeInfo?.storeName ?? "Loja"}
            </span>
          )}
        </Link>

        {/* Busca central */}
        <div className="flex-1 max-w-xl hidden md:flex">
          <Search />
        </div>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Search open={false} />
          </div>
          <ModeToggle />
        </div>
      </div>

      {/* Barra de categorias */}
      <nav className="hidden md:flex border-t bg-primary text-primary-foreground">
        <ul className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <li key={cat.href} className="shrink-0">
              <Link
                href={cat.href}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold hover:bg-primary-foreground/10 transition-colors whitespace-nowrap rounded"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
