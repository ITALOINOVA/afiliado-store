"use client"
import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App Error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 text-center">
      <h2 className="text-xl font-bold text-destructive">Algo deu errado</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        {error?.message || "Ocorreu um erro inesperado."}
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted"
        >
          Voltar à loja
        </Link>
      </div>
    </div>
  )
}
