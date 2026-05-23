"use client"
import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

type ImportResult = {
  url: string
  status: "pending" | "success" | "error"
  title?: string
  image?: string
  currentPrice?: number
  error?: string
}

export function BulkImport() {
  const [links, setLinks] = React.useState("")
  const [results, setResults] = React.useState<ImportResult[]>([])
  const [running, setRunning] = React.useState(false)

  async function startImport() {
    const urls = links
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)

    if (!urls.length) {
      toast.error("Cole pelo menos um link.")
      return
    }

    setRunning(true)
    const initial: ImportResult[] = urls.map((url) => ({ url, status: "pending" }))
    setResults(initial)

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      try {
        // 1. Importar dados do ML
        const mlRes = await fetch("/api/ml-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        })
        const mlData = await mlRes.json()
        if (!mlRes.ok) throw new Error(mlData.error ?? "Erro no ML")

        // 2. Criar produto no banco
        const createRes = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: mlData.title,
            image: mlData.image,
            currentPrice: mlData.currentPrice,
            originalPrice: mlData.originalPrice,
            productCode: mlData.productCode,
            website: mlData.website ?? "mercadolivre",
            buyLink: mlData.buyLink ?? url,
            published: true,
          }),
        })
        if (!createRes.ok) throw new Error("Erro ao salvar no banco")

        setResults((prev) => {
          const next = [...prev]
          next[i] = { url, status: "success", title: mlData.title, image: mlData.image, currentPrice: mlData.currentPrice }
          return next
        })
      } catch (err: any) {
        setResults((prev) => {
          const next = [...prev]
          next[i] = { url, status: "error", error: err.message ?? "Erro desconhecido" }
          return next
        })
      }
    }

    setRunning(false)
    toast.success("Importação concluída!")
  }

  const successCount = results.filter((r) => r.status === "success").length
  const errorCount   = results.filter((r) => r.status === "error").length

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📋 Cole os links — um por linha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={"https://mercadolivre.com.br/...\nhttps://mercadolivre.com.br/...\nhttps://mercadolivre.com.br/..."}
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            rows={8}
            className="font-mono text-xs"
            disabled={running}
          />
          <div className="flex gap-3 items-center">
            <Button onClick={startImport} disabled={running || !links.trim()}>
              {running ? "Importando..." : "🚀 Importar todos"}
            </Button>
            {!running && results.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {successCount} ok · {errorCount} erros
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {/* Status icon */}
                  <span className="shrink-0 text-base">
                    {r.status === "pending" && "⏳"}
                    {r.status === "success" && "✅"}
                    {r.status === "error"   && "❌"}
                  </span>

                  {r.status === "success" && r.image && (
                    <div className="w-10 h-10 bg-white border rounded overflow-hidden shrink-0">
                      <img src={r.image} alt={r.title} className="w-full h-full object-contain" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {r.status === "success" ? (
                      <>
                        <p className="font-medium truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {formatCurrency(r.currentPrice ?? 0)}
                        </p>
                      </>
                    ) : r.status === "error" ? (
                      <>
                        <p className="text-destructive font-medium truncate">{r.error}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.url}</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground truncate">{r.url}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
