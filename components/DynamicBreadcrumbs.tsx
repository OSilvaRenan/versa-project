"use client"

import React, { useMemo, useState, useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function BreadcrumbContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const breadcrumbItems = useMemo(() => {
    if (!mounted) return []

    const items: { label: string; href: string }[] = []
    const segments = pathname.split("/").filter(s => s && s !== "paginas")
    
    const isEntrada = searchParams.get("entrada") === "1"
    const queryEntrada = isEntrada ? "?entrada=1" : ""
    const idParam = searchParams.get("id")

    if (segments.includes("autor")) {
      items.push({
        label: "Autor",
        href: "/paginas/autor"
      })

      if (segments.includes("cadastro")) {
        const isEdicao = Boolean(idParam)
        items.push({
          label: isEdicao ? "Editar Autor" : "Novo Autor",
          href: `/paginas/autor/cadastro${isEdicao ? `?id=${idParam}` : ""}`
        })
      }
    }

    if (segments.includes("editora")) {
      items.push({
        label: "Editora",
        href: "/paginas/editora"
      })

      if (segments.includes("cadastro")) {
        const isEdicao = Boolean(idParam)
        items.push({
          label: isEdicao ? "Editar Editora" : "Nova Editora",
          href: `/paginas/editora/cadastro${isEdicao ? `?id=${idParam}` : ""}`
        })
      }
    }

    if (segments.some(s => s.includes("conferencia"))) {
      items.push({
        label: isEntrada ? "Conferência Entrada" : "Conferência",
        href: `/paginas/conferencia${queryEntrada}`
      })
    }

    const idPedido = segments.find(s => !isNaN(Number(s)))
    
    if (idPedido) {
      const idIndex = segments.indexOf(idPedido)
      const subPaginas = segments.slice(idIndex + 1)
      
      const nomesPersonalizados: Record<string, string> = {
        "conferencia-lista": "Conferência Lista",
        "separacao": "Separação"
      }

      let label = `Pedido ${idPedido}`
      
      if (subPaginas.length > 0) {
        const subNome = subPaginas.map(s => 
          nomesPersonalizados[s] || s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        ).join(" - ")
        
        label += ` • ${subNome}`
      }

      items.push({ 
        label, 
        href: pathname + queryEntrada 
      })
    }

    return items
  }, [pathname, searchParams, mounted])

  if (!mounted) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-foreground" href="/paginas/home">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.label + index}>
            <BreadcrumbSeparator className="text-foreground"/>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="font-bold text-foreground">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink className="text-foreground" href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function DynamicBreadcrumbs() {
  return (
    <Suspense fallback={null}>
      <BreadcrumbContent />
    </Suspense>
  )
}