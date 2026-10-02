"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  AtualizarQtdConferenciaLista,
  ConferenciaListaInicializa,
  ConferenciaListaProcessa,
  FinalizarConferencia,
} from "@/dbs/ConferenciaDb";
import { ConferenciaListaProcessaRequestDTO } from "@/DTO/ConferenciaDTO";
import {
  ConferenciaListaAtualizaQtdDTO,
  ConferenciaListaResponseDTO,
  Indseparacao,
  TipoQuantidade,
} from "@/DTO/ConferenciaListaDto";
import { AlertTriangle, CheckCircle, Package, Printer } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface Props {
  itens: ConferenciaListaResponseDTO[];
  loading: boolean;
  codconferencia: number;
  indsituacaoConferencia?: number;
  codempresa: number;
  atualizaLista: boolean;
  setAtualizaLista: (value: boolean) => void;
  indespecial?: number;
  // itensDivergentes: any[];
  // setItensDivergentes: (value: any[]) => void;
}

export const LstItensPedido = ({
  itens,
  loading,
  codconferencia,
  indsituacaoConferencia,
  atualizaLista,
  setAtualizaLista,
  codempresa,
  indespecial,
  // itensDivergentes,
  // setItensDivergentes
}: Props) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Resumo_Divergencias",
  });

  const [valores, setValores] = useState<
    Record<number, { ok?: number; danificada?: number }>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loadingVerificacao, setLoadingVerificacao] = useState(false);

  const handleInputChange = (
    codproduto: number,
    field: "ok" | "danificada",
    value: string,
  ) => {
    const numValue = parseInt(value) || 0;
    setValores((prev) => ({
      ...prev,
      [codproduto]: { ...prev[codproduto], [field]: numValue },
    }));
  };
  const [itensDivergentes, setItensDivergentes] = useState<any[]>([]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    codproduto: number,
    field: "ok" | "danificada",
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (field === "ok") {
        const proximoInput = inputRefs.current[`${codproduto}-danificada`];
        if (proximoInput) {
          proximoInput.focus();
          proximoInput.select();
        }
      } else {
        const proximoItem = itens[index + 1];
        if (proximoItem) {
          const proximoInput =
            inputRefs.current[`${proximoItem.Codproduto}-ok`];
          if (proximoInput) {
            proximoInput.focus();
            proximoInput.select();
          }
        }
      }
    }
  };

  const salvarQuantidade = async (
    item: ConferenciaListaResponseDTO,
    field: "ok" | "danificada",
    valorDigitado: number,
  ) => {
    const valorOriginal =
      field === "ok" ? item.QuantidadeOk : item.QuantidadeDanificada;
    if (valorDigitado === valorOriginal) return;

    try {
      const request: ConferenciaListaAtualizaQtdDTO[] = [
        {
          Codproduto: item.Codproduto,
          NovaQtd: valorDigitado,
          IndTipoQtd:
            field === "ok"
              ? TipoQuantidade.qtdOk
              : TipoQuantidade.qtdDanificada,
        },
      ];
      await AtualizarQtdConferenciaLista(codconferencia, request);
      toast({ title: "Salvo", description: "Quantidade atualizada." });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar.",
        variant: "destructive",
      });
    }
  };

  const handleAbrirFinalizacao = async () => {
    setLoadingVerificacao(true);
    setIsModalOpen(true);
    try {
      const requestProcessa: ConferenciaListaProcessaRequestDTO = {
        Codempresa: codempresa,
        Codusuario: session?.user?.Codusuario || 0,
      };
      const data = await ConferenciaListaProcessa(
        codconferencia,
        requestProcessa,
      );
      setItensDivergentes(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar finalização.",
        variant: "destructive",
      });
      setIsModalOpen(false);
    } finally {
      setLoadingVerificacao(false);
    }
  };

  const handleConfirmarFechamento = async () => {
    try {
      const request: ConferenciaListaProcessaRequestDTO = {
        Codempresa: codempresa,
        Codusuario: session?.user?.Codusuario || 0,
      };
      await FinalizarConferencia(codconferencia, request);

      toast({ title: "Sucesso", description: "Conferência finalizada!" });

      setAtualizaLista(!atualizaLista);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fechar.",
        variant: "destructive",
      });
    }
  };

  const handleConferenciaListaInicia = async () => {
    try {
      const request: ConferenciaListaProcessaRequestDTO = {
        Codempresa: codempresa,
        Codusuario: session?.user?.Codusuario || 0,
      };

      await ConferenciaListaInicializa(codconferencia, request);
      setAtualizaLista(!atualizaLista);
      toast({ title: "Sucesso", description: "Conferência Inicializada!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-5">
      <Card className="min-h-56 pt-2">
        <div className="flex w-full flex-row items-center justify-between h-auto m-0 p-0">
          <span className="text-xl font-semibold pl-8 text-nowrap">
            Itens deste pedido
          </span>
          {indsituacaoConferencia !== Indseparacao.Finalizado && indsituacaoConferencia !== Indseparacao.Cancelado && (
            <Button
              onClick={
                indsituacaoConferencia === Indseparacao.Pendente
                  ? handleConferenciaListaInicia
                  : handleAbrirFinalizacao
              }
              className="bg-primary ml-auto mr-4 text-xs md:text-sm"
              disabled={loading}
            >
              {loading
                ? "Carregando..."
                : indsituacaoConferencia === Indseparacao.Pendente
                  ? "Iniciar"
                  : "Finalizar"}
            </Button>
          )}
        </div>
        <CardContent className="py-2">
          {/* LISTA PRINCIPAL - DESKTOP */}
          <div className="hidden md:block">
            {indsituacaoConferencia !== Indseparacao.Pendente && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Qtde</TableHead>
                    <TableHead className="w-30">Qtd Ok</TableHead>
                    <TableHead className="w-30">Qtd Danificada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, index) => (
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
                          min={0}
                          className="h-8"
                          ref={(el) => {
                            inputRefs.current[`${item.Codproduto}-ok`] = el;
                          }}
                          defaultValue={item.QuantidadeOk}
                          onKeyDown={(e) =>
                            handleKeyDown(e, item.Codproduto, "ok", index)
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item.Codproduto,
                              "ok",
                              e.target.value,
                            )
                          }
                          onBlur={(e) => {
                            if (
                              indsituacaoConferencia === Indseparacao.Finalizado
                            )
                              return;
                            salvarQuantidade(
                              item,
                              "ok",
                              parseInt(e.target.value) || 0,
                            );
                          }}
                          readOnly={
                            indsituacaoConferencia != Indseparacao.EmConferencia
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          className="h-8"
                          ref={(el) => {
                            inputRefs.current[`${item.Codproduto}-danificada`] =
                              el;
                          }}
                          defaultValue={item.QuantidadeDanificada}
                          onKeyDown={(e) =>
                            handleKeyDown(
                              e,
                              item.Codproduto,
                              "danificada",
                              index,
                            )
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item.Codproduto,
                              "danificada",
                              e.target.value,
                            )
                          }
                          onBlur={(e) => {
                            if (
                              indsituacaoConferencia === Indseparacao.Finalizado
                            )
                              return;
                            salvarQuantidade(
                              item,
                              "danificada",
                              parseInt(e.target.value) || 0,
                            );
                          }}
                          readOnly={
                            indsituacaoConferencia != Indseparacao.EmConferencia
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* LISTA PRINCIPAL - MOBILE */}
          <div className="block md:hidden space-y-4">
            {indsituacaoConferencia !== Indseparacao.Pendente &&
              itens.map((item, index) => (
                <div
                  key={item.Codproduto}
                  className="border rounded-lg p-4 bg-card shadow-sm flex flex-col gap-3"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      ISBN: {item.Isbn}
                    </span>
                    <span className="font-semibold text-sm line-clamp-2">
                      {item.Nomproduto}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="font-medium">Qtde:</span>
                    <span className="ml-auto font-bold">{item.Quantidade}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium flex items-center gap-1 text-green-700">
                        <CheckCircle className="w-3 h-3" /> Qtd Ok
                      </label>
                      <Input
                        type="number"
                        min={0}
                        className="h-9"
                        ref={(el) => {
                          if (window.innerWidth < 768)
                            inputRefs.current[`${item.Codproduto}-ok`] = el;
                        }}
                        defaultValue={item.QuantidadeOk}
                        onKeyDown={(e) =>
                          handleKeyDown(e, item.Codproduto, "ok", index)
                        }
                        onChange={(e) =>
                          handleInputChange(
                            item.Codproduto,
                            "ok",
                            e.target.value,
                          )
                        }
                        onBlur={(e) => {
                          if (
                            indsituacaoConferencia === Indseparacao.Finalizado
                          )
                            return;
                          salvarQuantidade(
                            item,
                            "ok",
                            parseInt(e.target.value) || 0,
                          );
                        }}
                        readOnly={
                          indsituacaoConferencia != Indseparacao.EmConferencia
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium flex items-center gap-1 text-red-700">
                        <AlertTriangle className="w-3 h-3" /> Danificada
                      </label>
                      <Input
                        type="number"
                        min={0}
                        className="h-9"
                        ref={(el) => {
                          if (window.innerWidth < 768)
                            inputRefs.current[`${item.Codproduto}-danificada`] =
                              el;
                        }}
                        defaultValue={item.QuantidadeDanificada}
                        onKeyDown={(e) =>
                          handleKeyDown(e, item.Codproduto, "danificada", index)
                        }
                        onChange={(e) =>
                          handleInputChange(
                            item.Codproduto,
                            "danificada",
                            e.target.value,
                          )
                        }
                        onBlur={(e) => {
                          if (
                            indsituacaoConferencia === Indseparacao.Finalizado
                          )
                            return;
                          salvarQuantidade(
                            item,
                            "danificada",
                            parseInt(e.target.value) || 0,
                          );
                        }}
                        readOnly={
                          indsituacaoConferencia != Indseparacao.EmConferencia
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] h-[80vh] max-w-[95vw] md:w-[50vw] md:h-[50vh] md:max-w-[50vw] md:min-w-[50vw] md:min-h-[50vh] flex flex-col p-0 gap-0 overflow-hidden">
          <div
            ref={contentRef}
            className="flex flex-col flex-1 p-4 md:p-6 overflow-hidden print:h-auto print:overflow-visible print:p-0 print:block"
          >
            <DialogHeader className="print:mb-4">
              <DialogTitle className="text-xl md:text-2xl font-bold pb-2 print:pl-2">
                Resumo de Divergências
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto mt-4 print:mt-0 print:overflow-visible pr-2">
              {loadingVerificacao ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="min-w-full inline-block align-middle print:block">
                  {itensDivergentes.length === 0 ? (
                    <div className="p-8 text-center font-semibold text-muted-foreground">
                      Não existe divergências
                    </div>
                  ) : (
                    <>
                      {/* MODAL - TABELA (Sempre usada na Impressão) */}
                      <div className="hidden md:block print:block ">
                        <Table className="print:w-full print:table-fixed">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[10%] print:w-[15%]">Cod.</TableHead>
                              <TableHead className="w-[70%] print:w-[65%]">Produto</TableHead>
                              <TableHead className="text-right print:w-[20%]">
                                Diferença
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {itensDivergentes.map((it) => (
                              <TableRow
                                key={it.CodProduto}
                                className="print:break-inside-avoid"
                              >
                                <TableCell>
                                  <p>{it.CodProduto}</p>
                                </TableCell>
                                <TableCell>
                                  <p className="font-bold">{it.NomProduto}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ISBN: {it.Isbn}
                                  </p>
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-bold text-lg">
                                  {it.QtdNota > 0
                                    ? `+${it.QtdNota}`
                                    : it.QtdNota}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* MODAL - CARDS (Somente Mobile em tela) */}
                      <div className="block md:hidden space-y-3 print:hidden">
                        {itensDivergentes.map((it) => (
                          <div
                            key={it.CodProduto}
                            className="border rounded-lg p-3 bg-card shadow-sm flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-xs font-mono bg-muted px-1 rounded">
                                  Cod: {it.CodProduto}
                                </span>
                                <h4 className="font-bold text-sm mt-1">
                                  {it.NomProduto}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  ISBN: {it.Isbn}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="block text-xs text-muted-foreground">
                                  Diferença
                                </span>
                                <span className="text-red-600 font-bold text-xl">
                                  {it.QtdNota > 0
                                    ? `+${it.QtdNota}`
                                    : it.QtdNota}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="no-print p-4 md:p-6 border-t flex flex-col md:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handlePrint()}
              disabled={itensDivergentes.length === 0}
              className="w-full md:w-auto order-2 md:order-1"
            >
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto md:ml-auto order-1 md:order-2">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="w-full md:w-auto order-2 md:order-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmarFechamento}
                className="w-full md:w-auto order-1 md:order-2"
              >
                Confirmar Fechamento
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
