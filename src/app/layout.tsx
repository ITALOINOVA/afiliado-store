import type { Metadata } from "next"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { StoreProvider } from "@/contexts/StoreContext"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "JCG Distribuidora — Receptores, Antenas, Smart TV Box e muito mais",
  description: "As melhores ofertas em receptores satélite, LNBFs, antenas parabólicas e Smart TV Box. Preços de atacado com entrega para todo o Brasil.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="pt-br">
      <body>
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="none">
              <StoreProvider>
                {children}
                <Toaster />
              </StoreProvider>
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
