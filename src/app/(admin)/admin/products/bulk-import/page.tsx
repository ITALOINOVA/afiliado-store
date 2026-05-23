import { BulkImport } from "@/components/BulkImport"

export default function BulkImportPage() {
  return (
    <main className="mx-10 w-full gap-2 my-10 max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight text-primary mb-2">
        Importação em Lote
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Cole um link de afiliado do Mercado Livre por linha. Todos os produtos serão importados e publicados automaticamente.
      </p>
      <BulkImport />
    </main>
  )
}
