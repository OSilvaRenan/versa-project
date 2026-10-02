"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersVertical, X } from "lucide-react";
import ListaEditorasGrupo from "../../Combobox/ListaEditorasGrupo";
import { CboData } from "@/app/Combobox/CboEstatica";
import axios from "axios";
import { EditoraDTO } from "./EditoraDTO";
import { DialogCadastroEditora } from "./DialogCadastroEditora";
import { Input } from "@/components/ui/input";

export default function FiltersEditora() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [nomeditora, setNomeditora] = useState(
    searchParams.get("nomeditora") || "",
  );

  const [dataCbo, setDataCbo] = useState<CboData>({
    Value: "",
    Description: searchParams.get("nomeditoragrupo") || "",
  });

  const [data, setData] = useState<CboData[]>([]);

  const carregarOpcoes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/produto/editoragrupo`,
      );
      const dadosTransformados: CboData[] = response.data.Dados.map(
        (item: EditoraDTO) => ({
          Value: item.Codeditoragrupo.toString(),
          Description: item.Nomeditoragrupo,
        }),
      );
      setData(dadosTransformados);
    } catch (erro) {
      console.error("Erro ao carregar opções:", erro);
    }
  };

  useEffect(() => {
    carregarOpcoes();
  }, []);

  const handlePesquisa = () => {
    const params = new URLSearchParams();
    if (nomeditora.trim()) {
      params.set("nomeditora", nomeditora.trim());
    }
    if (dataCbo.Value && dataCbo.Value !== "-1")
      params.set("nomeditoragrupo", dataCbo.Description);
    params.set("pg", "1");

    router.push(`?${params.toString()}`);
  };

  const handleClearAllFilters = () => {
    setNomeditora("");
    setDataCbo({ Value: "", Description: "" });
    router.push(window.location.pathname);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Editoras
        </h1>
        <div className="flex items-center gap-2">
         
          <DialogCadastroEditora />
        </div>
      </div>

    
        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5 min-w-70 sm:min-w-90">
              <Label className="text-sm font-semibold text-gray-700">
               Editora:
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar por nome..."
                  className=" h-7 text-sm pr-8"
                  value={nomeditora}
                  onChange={(e) => setNomeditora(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePesquisa()}
                />
                {nomeditora && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setNomeditora("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400  w-6 p-0 hover:bg-transparent h-7"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col ">
              <ListaEditorasGrupo
                classNameCombo=" h-7 bg-card"
                classNameLista=" p-0 bg-card"
                classeNameInput="h-7"
                value={dataCbo}
                onChange={setDataCbo}
                id="Codeditoragrupo"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Button
                onClick={handlePesquisa}
                className="px-4 py-2 font-medium h-7"
              >
                <Search className="mr-1.5 h-4 w-4" /> Pesquisar
              </Button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Button
                variant="secondary"
                onClick={handleClearAllFilters}
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
