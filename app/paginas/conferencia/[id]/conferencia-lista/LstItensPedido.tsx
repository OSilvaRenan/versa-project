"use client";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  ConferenciaListaAtualizaQtdDTO,
  ConferenciaListaResponseDTO,
} from "@/DTO/ConferenciaListaDto";
import { AtualizarQtdConferenciaLista } from "@/dbs/SeparacaoDb";

interface Props {
  itens: ConferenciaListaResponseDTO[];
  loading: boolean;
  codconferencia: number;
}

export const LstItensPedido = ({ itens, loading, codconferencia }: Props) => {
  const { toast } = useToast();
  
  const [valores, setValores] = useState<Record<number, { ok?: number; danificada?: number }>>({});

  const handleInputChange = (
    codproduto: number,
    field: "ok" | "danificada",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setValores((prev) => ({
      ...prev,
      [codproduto]: {
        ...prev[codproduto],
        [field]: numValue,
      },
    }));
  };

  const salvarQuantidade = async (
    item: ConferenciaListaResponseDTO,
    field: "ok" | "danificada",
    valorDigitado: number
  ) => {
    const valorOriginal = field === "ok" ? item.QuantidadeOk : item.QuantidadeDanificada;
    if (valorDigitado === valorOriginal) return;

    try {
    
      const request: ConferenciaListaAtualizaQtdDTO = {
        Codproduto: item.Codproduto,
        QuantidadeOk: field === "ok" ? valorDigitado : (valores[item.Codproduto]?.ok ?? item.QuantidadeOk),
        QuantidadeDanificada: field === "danificada" ? valorDigitado : (valores[item.Codproduto]?.danificada ?? item.QuantidadeDanificada),
      };

      await AtualizarQtdConferenciaLista(codconferencia, request);

      toast({
        title: "Salvo",
        description: `Produto ${item.Codproduto} atualizado.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-5">
      <Card className="min-h-56">
        <CardTitle className="container flex flex-row justify-between py-2 self-center space-x-2 h-8">
          <span className="h-8">Itens deste pedido</span>
        </CardTitle>
        <CardContent className="py-2">
          <div className="mx-auto min-h-14 py-2">
            {loading ? (
              <>
                <Skeleton className="h-12.5 w-full bg-slate-300 my-2 " />
                <Skeleton className="h-50 w-full bg-slate-300 my-2" />
              </>
            ) : itens.length === 0 ? (
              <span>Nenhum item encontrado</span>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ISBN</TableHead>
                    <TableHead className="min-w-62.5">Produto</TableHead>
                    <TableHead className="text-center">Qtd Nota</TableHead>
                    <TableHead className="w-30">Qtd Ok</TableHead>
                    <TableHead className="w-30">Qtd Danificada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item) => (
                    <TableRow key={item.Codproduto}>
                      <TableCell>{item.Isbn}</TableCell>
                      <TableCell className="font-medium">
                        {item.Nomproduto}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.Quantidade}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="h-8"
                          defaultValue={item.QuantidadeOk}
                          onChange={(e) =>
                            handleInputChange(item.Codproduto, "ok", e.target.value)
                          }
                          onBlur={(e) => 
                            salvarQuantidade(item, "ok", parseInt(e.target.value) || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="h-8"
                          defaultValue={item.QuantidadeDanificada}
                          onChange={(e) =>
                            handleInputChange(item.Codproduto, "danificada", e.target.value)
                          }
                          onBlur={(e) => 
                            salvarQuantidade(item, "danificada", parseInt(e.target.value) || 0)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};