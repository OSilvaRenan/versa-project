"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  ConferenciaListaProcessa,
  ListaDadosConferencia,
  ReinicializaConferenciaLista,
} from "@/dbs/ConferenciaDb";
import { ListaProdutosConferenciaLista } from "@/dbs/SeparacaoDb";
import {
  ConferenciaListaResponseDTO,
  Indseparacao,
} from "@/DTO/ConferenciaListaDto";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
  ConferenciaListaProcessaRequestDTO,
  ConferenciaResponseDTO,
} from "../../../../../DTO/ConferenciaDTO";
import { useConferencia } from "../_components/ConferenciaContext";
import { FiltersItensPedido } from "../_components/FiltersItensPedido";
import { LstItensPedido } from "./LstItensPedido";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ConferenciaListaPage({ params }: Props) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { data: session, status } = useSession();
  // const [itensDivergentes, setItensDivergentes] = useState<any[]>([]);
  const [atualizaLista, setAtualizaLista] = useState<boolean>(false);
  const situacoesInvalidas = [
    Indseparacao.Finalizado,
    Indseparacao.Cancelado,
    Indseparacao.EmOnda,
    Indseparacao.EmSeparacao,
    Indseparacao.Pendente,
  ];

  const {
    SetDadosConferencia,
    SetDadosConferenciaLista,
    conferencia,
    itensConferenciaLista,
    loading,
  } = useConferencia();

  const buscaDadosConferencia = async () => {
    const dadosConferencia: ConferenciaResponseDTO =
      await ListaDadosConferencia(id);

    if (dadosConferencia) {
      SetDadosConferencia(dadosConferencia);
    }
  };

  const buscaItensConferenciaLista = async () => {
    const itensConferenciaLista: ConferenciaListaResponseDTO[] =
      await ListaProdutosConferenciaLista(id);

    if (itensConferenciaLista) {
      SetDadosConferenciaLista(itensConferenciaLista);
    }
  };

  const AtualizaListas = async () => {
    buscaDadosConferencia();
    buscaItensConferenciaLista();
  };

useEffect(() => {
  if (id) {
    AtualizaListas();
  }
}, [id, atualizaLista]);

  const navigation = useRouter();


  const handleReinicializa = async () => {
    try {
      var request: ConferenciaListaProcessaRequestDTO = {
        Codempresa: conferencia!.Codempresa,
        Codusuario: session?.user?.Codusuario ?? 0,
      };

      SetDadosConferenciaLista([]);

      await ReinicializaConferenciaLista(id, request).then(() => {
        setAtualizaLista((prev) => !prev);

        toast({ title: "Sucesso", description: "Conferência reinicializada!" });
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reinicializar a conferência.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="w-full max-w-[100vw] px-3 md:px-0 pb-4 overflow-x-hidden box-border">
      {/* HEADER */}
      <div className="flex flex-nowrap w-full items-center justify-between gap-3 mb-4 md:mb-3">
        <h1 className="flex-1 text-sm lg:text-lg font-bold md:text-xl truncate min-w-0">
          Pedido Nº {id} | {conferencia?.Situacaoconferencia}
        </h1>
        {(
          (
            conferencia?.Indseparacao == Indseparacao.EmConferencia || conferencia?.Indseparacao == Indseparacao.Finalizado ) ||
            conferencia?.Indseparacao != Indseparacao.Pendente ) && (
          <Button
            variant="default"
            onClick={handleReinicializa}
            disabled={loading}
          >
            Reinicializar
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={() => navigation.back()}
          className="shrink-0 lg:h-9 text-xs md:h-10 md:px-4 md:text-sm"
        >
          Voltar
        </Button>
      </div>
      <FiltersItensPedido params={{ id }} />
      <LstItensPedido
        codconferencia={parseInt(id)}
        codempresa={conferencia?.Codempresa!}
        itens={itensConferenciaLista}
        loading={loading}
        setAtualizaLista={setAtualizaLista}
        atualizaLista={atualizaLista}
        indsituacaoConferencia={conferencia?.Indseparacao}
        indespecial={conferencia?.Indespecial}
        // itensDivergentes={itensDivergentes}
        // setItensDivergentes={setItensDivergentes}
      />
    </div>
  );
}
