"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";
import { Camera, CameraOff, Package, Search } from "lucide-react";
import { formatarDinheiro } from "@/app/functions/functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Paginacao from "../[conferencia]/paginacao";
import { Page } from "@/DTO/PageDTO";
import { ConsultaPreco } from "@/dbs/ProdutoDb";

interface Produtos {
  Codproduto: number;
  Titulo: string;
  Isbn: string;
  Pathimage: string;
  Preco: string;
}

interface PaginedList<T> {
  Dados: T[];
  Page: Page;
}

export interface searchQuery {
  pg: string;
}

interface Props {
  searchParams: Promise<searchQuery>;
}

export default function ConsultaPrecoPage({ searchParams }: Props) {
  const params = React.use(searchParams);
  const [searchQuery, setSearchQuery] = useState("");
  const [camera, setCamera] = useState(false);
  const [open, setOpen] = useState(false);
  const [produtos, setProdutos] = useState<PaginedList<Produtos>>();
  const [loading, setLoading] = useState(false);

 const buscaProduto = useCallback(async (termoEspecifico?: string) => {
  setLoading(true);
  const textoParaBuscar = typeof termoEspecifico === "string" ? termoEspecifico : searchQuery;
  const textoLimpo = textoParaBuscar.trim();

  if (!textoLimpo && !termoEspecifico) { 
      setLoading(false);
      return; 
  }

  const isISBN = /^[0-9]{10,13}$/.test(textoLimpo);
  const request = {
    Nome: isISBN ? "" : textoLimpo,
    Editora: "",
    ISBN: isISBN ? textoLimpo : "",
    PageIndex: params.pg ? parseInt(params.pg) : 1,
    PageSize: 10,
  };

  try {
    const response = await ConsultaPreco(request);
    
    // Verificação de segurança: checa se response e response.data existem
    if (response && response.data) {
      setProdutos(response.data);
    }
  } catch (error) {
    console.error("Erro capturado na busca:", error);
    // Aqui o estado é resetado com segurança se a API der 404 ou 500
    setProdutos({
      Dados: [],
      Page: { PageIndex: 0, PageSize: 0, RecordsCount: 0 },
    });
  } finally {
    setLoading(false);
  }
}, [searchQuery, params.pg]);

  const handleDetected = (code: string) => {
    setSearchQuery(code); 
    buscaProduto(code);   
    setCamera(false);
    setOpen(false);
  };

  function OpenDialog() {
    setOpen((open) => !open);
    setCamera((camera) => !camera);
  }

  useEffect(() => {
    if (searchQuery !== "") {
      buscaProduto();
    }
  }, [params.pg]); 

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      buscaProduto();
    }
  };

  return (
    <div className="mx-5">
      <div className="flex flex-row justify-between py-2 self-center">
        <span className="py-2">Consulta Preço</span>
      </div>
      <Card className="min-h-42.5 max-w-full">
        <CardContent>
          <div className="flex flex-wrap lg:space-x-2 items-end">
            <div className="flex flex-col mb-2 lg:mb-0 mr-1">
              <Label className="py-2" htmlFor="isbn">
                Isbn:
              </Label>
              <Input
                type="text"
                id="isbn"
                name="isbn"
                className="h-8 w-full lg:w-75 max-w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex flex-col mb-2 lg:mb-0 mr-1">
              <Dialog open={open} onOpenChange={OpenDialog} modal={true}>
                <DialogTrigger
                  asChild
                  className="flex items-center justify-center h-8"
                >
                  <Button variant="default">
                    {camera ? <CameraOff /> : <Camera />}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full">
                  <DialogHeader>
                    <DialogTitle>Scanear Código de Barras</DialogTitle>
                  </DialogHeader>
                  <div className="p-0 lg:mt-2 justify-items-start">
                    {camera && <BarcodeScanner onDetected={handleDetected} />}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col mb-2 lg:mb-0">
              <Button
                onClick={() => buscaProduto()} 
                type="button"
                id="btnSearch"
                className="h-8"
              >
                <Search />
              </Button>
            </div>
          </div>

          <div className="container mx-auto p-4">
            {loading && <p>Carregando...</p>}
            {!loading && produtos?.Dados.length === 0 && (
              <p>Nenhum produto encontrado</p>
            )}
            {!loading &&
              produtos &&
              produtos.Dados.map((produto) => (
                <div
                  key={produto.Codproduto}
                  className="max-w-full w-full overflow-hidden shadow-lg bg-background p-4 mb-4 flex items-center  rounded-sm"
                >
                  <div className="flex-1">
                    <div className="font-bold text-xl mb-2">
                      {produto.Titulo}
                    </div>
                    <p className=" text-base">
                      <strong>ISBN:</strong> {produto.Isbn}
                    </p>
                    <p className=" text-base">
                      <strong>Valor:</strong> {formatarDinheiro(produto.Preco)}
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-300 shrink-0 flex justify-center items-center ml-4">
                    {produto.Pathimage ? (
                      <img
                        src={produto.Pathimage}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 " />
                    )}
                  </div>
                </div>
              ))}
          </div>
          {produtos?.Page ? (
            <Paginacao page={produtos?.Page!} rota="consultapreco" />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}