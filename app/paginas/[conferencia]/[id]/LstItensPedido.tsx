import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrashIcon } from "@radix-ui/react-icons";
import { DrawerConfereProduto } from "./_components/DrawerConfereProduto";
import { useConferencia } from "./_components/ConferenciaContext";
import {
  ExcluiCaixaConferencia,
  ExcluiLeituraConferencia,
} from "@/dbs/ConferenciaDb";
import {
  conferenciaItensResponseDTO,
  conferenciaCaixasResponseDTO,
} from "@/DTO/ConferenciaDTO";
import { useEffect } from "react";

interface Props {
  exibirBtnLeitura: boolean;
}

export const LstItensPedido = ({ exibirBtnLeitura }: Props) => {
  const {
    loading,
    ExcluirCaixa,
    ExcluirLeitura,
    itensLidosLocal,
    lstCaixas,
    produtosConferencia,
  } = useConferencia();


  useEffect(() => {
  }, [lstCaixas]);
  
  const handleExcluirLeitura = async (
    isbn: string,
    seqconferenciaitem: number,
    qtdconferida: number,
  ) => {
    await ExcluiLeituraConferencia(seqconferenciaitem);
    ExcluirLeitura(isbn, seqconferenciaitem, qtdconferida);
  };

  const handleExcluirCaixa = async (
    codconferencia: number,
    nrocaixa: number,
  ) => {
    try {
      const seqconferenciacaixa = await ExcluiCaixaConferencia(
        codconferencia,
        nrocaixa,
      );

     
      if (seqconferenciacaixa != null && seqconferenciacaixa > 0) {
        ExcluirCaixa(codconferencia, nrocaixa, seqconferenciacaixa);
      }
    } catch (error) {
      console.error("Erro ao excluir caixa:", error);
      // Adicione um toast de erro aqui se desejar
    }
  };

  const CarregaTabelaItensLidosBanco = (
    itens: conferenciaItensResponseDTO[],
  ) => (
    <>
      {/* VERSÃO DESKTOP */}
      <div className="hidden lg:block">
        <Table className="max-h-full">
          <TableHeader>
            <TableRow>
              <TableHead>Isbn</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Qtd Lida</TableHead>
              <TableHead>Caixa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens
              .sort((a, b) => b.Seqconferenciaitem - a.Seqconferenciaitem)
              .map((item, index) => (
                <TableRow key={index} className="h-2 p-0 w-full">
                  <TableCell className="font-medium w-12.5">
                    {item.Isbn}
                  </TableCell>
                  <TableCell className="font-medium w-75">
                    {item.Nomproduto}
                  </TableCell>
                  <TableCell className="font-medium w-12.5">
                    {item.Quantidade}
                  </TableCell>
                  <TableCell className="font-medium w-12.5">
                    {item.Nrocaixa}
                  </TableCell>
                  {exibirBtnLeitura && index === 0 && (
                    <TableCell className="font-medium w-12.5">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleExcluirLeitura(
                            item.Isbn,
                            item.Seqconferenciaitem,
                            item.Qtdconferida,
                          )
                        }
                      >
                        <TrashIcon />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* VERSÃO MOBILE */}
      <div className="flex flex-col gap-3 lg:hidden">
        {itens
          .sort((a, b) => b.Seqconferenciaitem - a.Seqconferenciaitem)
          .map((item, index) => (
            <div
              key={index}
              className="flex flex-col border rounded-lg p-4 shadow-sm gap-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Isbn
                  </span>
                  <span className="font-semibold text-sm">{item.Isbn}</span>
                </div>
                {exibirBtnLeitura && index === 0 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() =>
                      handleExcluirLeitura(
                        item.Isbn,
                        item.Seqconferenciaitem,
                        item.Qtdconferida,
                      )
                    }
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Produto
                </span>
                <span className="font-medium text-sm leading-tight">
                  {item.Nomproduto}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t mt-1">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Qtd Lida
                  </span>
                  <span className="font-bold text-base">{item.Quantidade}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Caixa
                  </span>
                  <span className="font-bold text-base">{item.Nrocaixa}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );

  const CarregaTabelaItensPedido = (items: conferenciaItensResponseDTO[]) => (
    <>
      {/* VERSÃO DESKTOP */}
      <div className="hidden lg:block">
        <Table className="max-h-full">
          <TableHeader>
            <TableRow>
              <TableHead>Isbn</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Qtd Conferida</TableHead>
              <TableHead>Localização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const isError = item.Quantidade > item.Qtdconferida;
              const textColor = isError ? "text-destructive" : "";
              return (
                <TableRow key={index} className="h-2 p-0 w-full">
                  <TableCell className={`font-medium w-25 ${textColor}`}>
                    {item.Isbn}
                  </TableCell>
                  <TableCell
                    className={`font-medium min-w-100 w-100 ${textColor}`}
                  >
                    {item.Nomproduto}
                  </TableCell>
                  <TableCell className={`font-medium w-25 ${textColor}`}>
                    {item.Quantidade}
                  </TableCell>
                  <TableCell className={`font-medium w-25 ${textColor}`}>
                    {item.Qtdconferida}
                  </TableCell>
                  <TableCell className={`font-medium w-25 ${textColor}`}>
                    {item.Localizacao}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* VERSÃO MOBILE */}
      <div className="flex flex-col gap-3 lg:hidden">
        {items.map((item, index) => {
          const isError = item.Quantidade > item.Qtdconferida;
          const valueColor = isError
            ? "text-destructive font-bold"
            : "font-semibold";

          return (
            <div
              key={index}
              className="flex flex-col border rounded-lg p-4 shadow-sm gap-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span
                    className={`text-xs uppercase tracking-wider text-muted-foreground`}
                  >
                    Isbn
                  </span>
                  <span className={`text-sm ${valueColor}`}>{item.Isbn}</span>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span
                    className={`text-xs uppercase tracking-wider text-muted-foreground`}
                  >
                    Localização
                  </span>
                  <span className={`text-sm ${valueColor}`}>
                    {item.Localizacao}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xs uppercase tracking-wider text-muted-foreground`}
                >
                  Produto
                </span>
                <span className={`text-sm leading-tight ${valueColor}`}>
                  {item.Nomproduto}
                </span>
              </div>
              <div
                className={`flex justify-between items-center pt-2 border-t mt-1 `}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-xs uppercase tracking-wider text-muted-foreground`}
                  >
                    Qtd Prevista
                  </span>
                  <span className={`text-base ${valueColor}`}>
                    {item.Quantidade}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs uppercase tracking-wider text-muted-foreground`}
                  >
                    Qtd Conferida
                  </span>
                  <span className={`text-base ${valueColor}`}>
                    {item.Qtdconferida}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const CarregaTabelaCaixa = (items: conferenciaCaixasResponseDTO[]) => (
    <>
      {/* VERSÃO DESKTOP */}
      <div className="hidden lg:block">
        <Table className="max-h-full">
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Embalagem</TableHead>
              <TableHead>Peso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} className="h-2 p-0 w-full">
                <TableCell className="font-medium w-75">
                  {item.Nrocaixa}
                </TableCell>
                <TableCell className="font-medium w-12.5">
                  {item.Dscembalagem}
                </TableCell>
                <TableCell className="font-medium w-12.5">
                  {item.Pesobruto}
                </TableCell>
                {exibirBtnLeitura && index === 0 && (
                  <TableCell className="font-medium w-12.5">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleExcluirCaixa(item.Codconferencia, item.Nrocaixa)
                      }
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* VERSÃO MOBILE */}
      <div className="flex flex-col gap-3 lg:hidden">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col border rounded-lg p-4 shadow-sm gap-3"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Número da Caixa
                </span>
                <span className="font-bold text-lg">{item.Nrocaixa}</span>
              </div>
              {exibirBtnLeitura && index === 0 && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() =>
                    handleExcluirCaixa(item.Codconferencia, item.Nrocaixa)
                  }
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider ">
                  Embalagem
                </span>
                <span className="font-medium text-sm">{item.Dscembalagem}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Peso Bruto
                </span>
                <span className="font-medium text-sm">{item.Pesobruto}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="py-5">
      <Card className="min-h-56 pt-2">
        <Tabs defaultValue="leiturasRealizadas">
          <CardTitle className="flex flex-nowrap w-full items-center justify-end ">
            <div className="flex flex-row justify-between py-2 self-center  w-full">
              <TabsList className="w-full flex h-auto lg:h-10 lg:w-auto align-center justify-start lg:justify-center px-2 lg:pl-6">
                <TabsTrigger
                  value="leiturasRealizadas"
                  className="font-medium w-full"
                >
                  Leituras
                </TabsTrigger>
                <TabsTrigger value="itensPedido" className="font-medium w-full">
                  Itens
                </TabsTrigger>
                <TabsTrigger value="caixa" className="font-medium w-full">
                  Caixas
                </TabsTrigger>
              </TabsList>
            </div>
            {exibirBtnLeitura && <DrawerConfereProduto />}
          </CardTitle>
          <CardContent className="p-0 lg:p-6">
            <TabsContent value="leiturasRealizadas" className="mx-3">
              <div className="mx-auto min-h-14 py-2">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : itensLidosLocal.length > 0 ? (
                  CarregaTabelaItensLidosBanco(itensLidosLocal)
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Nenhuma leitura realizada
                  </span>
                )}
              </div>
            </TabsContent>

            <TabsContent value="itensPedido" className="mx-3">
              <div className="mx-auto min-h-14 py-2">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : produtosConferencia.length > 0 ? (
                  CarregaTabelaItensPedido(produtosConferencia)
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Nenhum item encontrado
                  </span>
                )}
              </div>
            </TabsContent>

            <TabsContent value="caixa" className="mx-3">
              <div className="mx-auto min-h-14 py-2">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : lstCaixas.length > 0 ? (
                  CarregaTabelaCaixa(lstCaixas)
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Nenhuma Caixa encontrada
                  </span>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};


