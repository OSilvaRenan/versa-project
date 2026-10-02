"use client";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LstItensPedido } from "./LstItensPedido";
import { DrawerAtualizaQtd } from "../_components/DrawerAtualizaQtd";
import { ActionsSeparacao } from "@/components/ActionsSeparacao";
import { useEffect, useState } from "react";
import { ConferenciaResponseDTO } from "../../../../../DTO/ConferenciaDTO";
import axios from "axios";
import { ActionsSeparacaoMobile } from "@/components/ActionsSeparacaoMobile";
import { ListaProdutosSeparacao } from "@/dbs/SeparacaoDb";
import { ListaDadosConferencia } from "@/dbs/ConferenciaDb";
import {
  CancelarSeparacaoRequest,
  separacaoResponse,
} from "@/DTO/SeparacaoDTO";
import { useConferencia } from "../_components/ConferenciaContext";
import { FiltersItensPedido } from "../_components/FiltersItensPedido";
import { Indseparacao } from "@/DTO/ConferenciaListaDto";

interface Props {
  params: Promise<{ id: string }>;
}

export default function SeparacaoPage({ params }: Props) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [atualizaLista, setAtualizaLista] = useState<boolean>(true);

  const {
    SetDadosConferencia,
    SetDadosSeparacao,
    conferencia,
    itensSeparacao,
    loading,
  } = useConferencia();

  const buscaDadosConferencia = async () => {
    const dadosConferencia: ConferenciaResponseDTO =
      await ListaDadosConferencia(id);

    if (dadosConferencia) {
      SetDadosConferencia(dadosConferencia);
    }
  };

  const buscaItensConferencia = async () => {
    const itensSeparacao: separacaoResponse[] =
      await ListaProdutosSeparacao(id);

    if (itensSeparacao) {
      SetDadosSeparacao(itensSeparacao);
    }
  };

  async function CancelarSeparacao() {
    try {
      var request: CancelarSeparacaoRequest = {
        Codconferencia: conferencia!.Codconferencia,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/conferencia/cancelaonda`,
        request,
      );
    } catch (error) {
      console.error("Erro ao iniciar separação:", error);
    }
  }

  useEffect(() => {
    buscaDadosConferencia();
    buscaItensConferencia();
  }, [id, atualizaLista]);

  const navigation = useRouter();

  return (
      <div className="w-full max-w-[100vw] px-3 md:px-0 pb-4 overflow-x-hidden box-border">
        {/* HEADER */}
        <div className="flex flex-nowrap w-full items-center justify-between gap-3 mb-4 md:mb-3">
          <h1 className="flex-1 text-sm lg:text-lg font-bold md:text-xl truncate min-w-0">
            Pedido Nº {id} | {conferencia?.Situacaoconferencia}
          </h1>
          <div className="hidden lg:flex space-x-2 align-bottom ">
            <DrawerAtualizaQtd
              itens={itensSeparacao}
              setAtualizaLista={setAtualizaLista}
              atualizaLista={atualizaLista}
              situacaoConferencia={conferencia?.Situacaoconferencia ?? ""}
              codconferencia={parseInt(id)}
              disabled={
                conferencia?.Indseparacao == 0 || conferencia?.Indseparacao == 9
                  ? false
                  : true
              }
            />
            <Button
              disabled={conferencia?.Indseparacao == 9 ? false : true}
              onClick={CancelarSeparacao}
              type="button"
            >
              Cancelar Separação
            </Button>
            <Button type="button">Enviar P/Separação</Button>
            <ActionsSeparacao />
            <Button
              variant="secondary"
              onClick={() => navigation.back()}
              type="button"
            >
              Voltar
            </Button>
          </div>
          <div className="lg:hidden flex">
            <ActionsSeparacaoMobile
              disabled={conferencia?.Indseparacao == Indseparacao.EmSeparacao ? false : true}
              CancelarSeparacao={CancelarSeparacao}
            />
          </div>
        </div>
      
      <FiltersItensPedido params={{ id }} />
      <LstItensPedido itens={itensSeparacao} loading={loading} />
      </div>
  );
}
