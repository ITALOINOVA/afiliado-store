"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminNavbar from "@/components/AdminNavbar"
import { AdminSidebar } from "@/components/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Checa se tem sessão admin válida
    fetch("/api/auth/login", { method: "GET" })
      .catch(() => null)
      .finally(() => {
        // Tenta acessar rota protegida
        fetch("/api/products")
          .then(res => {
            if (!res.ok) router.replace("/admin/login")
            else setReady(true)
          })
          .catch(() => router.replace("/admin/login"))
      })
  }, [])

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <>
      <AdminNavbar className="lg:hidden block" />
      <div className="flex">
        <AdminSidebar className="hidden lg:block" />
        {children}
      </div>
    </>
  )
}
