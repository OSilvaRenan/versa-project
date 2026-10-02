"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, RotateCw, X, Link, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FiltersAutor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [nomautor, setNomautor] = useState(searchParams.get("nomautor") || "");

  const handlePesquisa = () => {
    const params = new URLSearchParams();

    if (nomautor.trim()) {
      params.set("nomautor", nomautor.trim());
    }

    params.set("pg", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setNomautor("");
    router.push(pathname);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Autores
        </h1>
        <div className="flex items-center gap-2">
          <Button className="px-4 py-2 font-medium">
            <a href="/paginas/autor/cadastro">
              Cadastrar
            </a>
          </Button>
          {/* <Button onClick={handlePesquisa} className="px-4 py-2 font-medium">
            <Search className="mr-1.5 h-4 w-4" /> Pesquisar
          </Button> */}
          {/* <Button
            variant="secondary"
            onClick={handlePesquisa}
            className="px-4 py-2 font-medium"
          >
            <RotateCw className="mr-1.5 h-4 w-4" /> Atualizar
          </Button> */}
        </div>
      </div>

      {/* Card de Filtro */}
      <div className="bg-card border rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-70 sm:min-w-90">
            <Label className="text-sm font-semibold text-gray-700">
              Nome do Autor:
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por nome..."
                className=" h-7 text-sm pr-8"
                value={nomautor}
                onChange={(e) => setNomautor(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePesquisa()}
              />
              {nomautor && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setNomautor("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400  w-6 p-0 hover:bg-transparent h-7"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button onClick={handlePesquisa} className="px-4 py-2 font-medium h-7">
            <Search className="mr-1.5 h-4 w-4" /> Pesquisar
          </Button>
          </div>
 
          <div className="flex flex-col gap-1.5">
            <Button
              variant="secondary"
              onClick={handleClear}
              className="h-7 text-sm"
            >
              Limpar Filtro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
