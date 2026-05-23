"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Product } from "@/lib/types"
import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { fetchProduct, updateProduct } from "@/lib/api"
import { Skeleton } from "./ui/skeleton"

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(2, {
    message: "Você precisa definir um título para o produto.",
  }),
  image: z.string(),
  currentPrice: z.string(),
  originalPrice: z.string(),
  recurrencePrice: z.string(),
  buyLink: z.string().min(2, {
    message: "Você precisa definir um link de encaminhamento.",
  }),
  announcement: z.string(),
  productCode: z.string(),
  catchyText: z.string(),
  conditionPayment: z.string(),
  website: z.string(),
  cupom: z.string(),
  cupomValue: z.string(),
  published: z.boolean(),
  urlProduct: z.string(),
})

export function FormEditProduct({ id }: { id: string }) {
  const [importing, setImporting] = React.useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      title: "",
      image: "",
      currentPrice: "",
      originalPrice: "",
      recurrencePrice: "",
      buyLink: "",
      announcement: "",
      productCode: "",
      catchyText: "",
      conditionPayment: "",
      website: "",
      cupom: "",
      cupomValue: "",
      published: false,
      urlProduct: "",
    },
  })

  const [product, setProduct] = React.useState<Product | null>(null)

  // Função para realizar a pesquisa de produtos usando a API
  const fetchProductAPI = React.useCallback(async () => {
    try {
      const response = await fetchProduct(id) as Product

      // Convertendo cupomValue, currentPrice, originalPrice para string
      const updatedProduct: any = {
        ...response,
        cupomValue: response.cupomValue?.toString(),
        currentPrice: response.currentPrice?.toString(),
        recurrencePrice: response.recurrencePrice?.toString(),
        originalPrice: response.originalPrice?.toString(),
      }

      if (response) {
        setProduct(updatedProduct)
        form.setValue("catchyText", updatedProduct.catchyText || "")
        form.setValue("cupom", updatedProduct.cupom || "")
        form.setValue("cupomValue", updatedProduct.cupomValue || "")
        form.setValue("title", updatedProduct.title || "")
        form.setValue("image", updatedProduct.image || "")
        form.setValue("currentPrice", updatedProduct.currentPrice || "")
        form.setValue("originalPrice", updatedProduct.originalPrice || "")
        form.setValue("recurrencePrice", updatedProduct.recurrencePrice || "")
        form.setValue("buyLink", updatedProduct.buyLink || "")
        form.setValue("conditionPayment", updatedProduct.conditionPayment || "")
        form.setValue("website", updatedProduct.website || "")
        form.setValue("id", updatedProduct.customId || "")
      }
    } catch (error) {
      console.error("Erro ao buscar produto", error)
      setProduct(null)
    }
  }, [id, form])

  // Efeito para acionar a pesquisa quando o termo de pesquisa é alterado
  React.useEffect(() => {
    fetchProductAPI()
  }, [fetchProductAPI])

  async function onMLImport(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    const url = form.getValues("urlProduct")
    if (!url) {
      toast.error("Cole o link de afiliado do Mercado Livre no campo URL.")
      return
    }
    setImporting(true)
    try {
      const res = await fetch("/api/ml-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao importar produto.")
        return
      }
      form.setValue("title", data.title ?? "")
      form.setValue("image", data.image ?? "")
      form.setValue("currentPrice", String(data.currentPrice ?? ""))
      form.setValue("originalPrice", String(data.originalPrice ?? ""))
      form.setValue("productCode", data.productCode ?? "")
      form.setValue("website", data.website ?? "mercadolivre")
      form.setValue("buyLink", data.buyLink ?? url)
      toast.success("Produto importado do Mercado Livre!", { description: data.title })
    } catch {
      toast.error("Falha na conexão ao importar produto.")
    } finally {
      setImporting(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      cupomValue,
      currentPrice,
      originalPrice,
      recurrencePrice,
      urlProduct,
      id,
      ...valuesWithout
    } = values
    console.log("Editando produto", id)

    const convertedValues = {
      ...valuesWithout,
      cupomValue: parseFloat(cupomValue),
      currentPrice: parseFloat(currentPrice),
      originalPrice: parseFloat(originalPrice),
    }
    const response = await updateProduct(id, convertedValues)
    if (response) {
      toast.success("Produto editado com sucesso!")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mt-10 w-full"
      >
        {/* ML Import */}
        <FormField
          control={form.control}
          name="urlProduct"
          render={({ field }) => (
            <FormItem className="w-2/3">
              <FormLabel>Importar pelo link ML</FormLabel>
              <FormControl>
                <div className="flex gap-3 items-center">
                  <Input placeholder="https://mercadolivre.com.br/..." {...field} />
                  <Button
                    onClick={onMLImport}
                    disabled={importing}
                    className="whitespace-nowrap"
                  >
                    {importing ? "Importando..." : "🛒 Importar ML"}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Cole o link de afiliado para atualizar título, preço e imagem automaticamente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="catchyText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto Chamativo</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cupom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cupom</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cupomValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Cupom</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do produto</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-20" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conditionPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condições</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />

        <div className="flex w-full justify-between gap-2">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Preço Antigo</FormLabel>
                {product ? (
                  <>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </>
                ) : (
                  <Skeleton className="w-full h-10" />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentPrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Preço Atual</FormLabel>
                {product ? (
                  <>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </>
                ) : (
                  <Skeleton className="w-full h-10" />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrencePrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Preço Recorrente</FormLabel>
                {product ? (
                  <>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </>
                ) : (
                  <Skeleton className="w-full h-10" />
                )}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="buyLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link de compra</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {field.value && (
                    <div className="mt-2 w-24 h-24 border rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      <img src={field.value} alt="Preview" className="object-contain w-full h-full" />
                    </div>
                  )}
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="announcement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anúncio</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              {product ? (
                <>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </FormItem>
          )}
        />
        {product ? (
          <Button type="submit">Editar Produto</Button>
        ) : (
          <Skeleton className="w-32 h-10" />
        )}
      </form>
    </Form>
  )
}
