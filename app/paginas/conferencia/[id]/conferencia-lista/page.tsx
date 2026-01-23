"use client";
import { ActionsSeparacaoMobile } from "@/components/ActionsSeparacaoMobile";
import { Button } from "@/components/ui/button";
import { ListaDadosConferencia } from "@/dbs/ConferenciaDb";
import {
    ListaProdutosConferenciaLista
} from "@/dbs/SeparacaoDb";
import { ConferenciaListaResponseDTO } from "@/DTO/ConferenciaListaDto";
import {
    CancelarSeparacaoRequest
} from "@/DTO/SeparacaoDTO";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ConferenciaResponseDTO } from "../../../../../DTO/ConferenciaDTO";
import { useConferencia } from "../_components/ConferenciaContext";
import { FiltersItensPedido } from "../_components/FiltersItensPedido";
import { LstItensPedido } from "./LstItensPedido";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ConferenciaListaPage({ params }: Props) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [atualizaLista, setAtualizaLista] = useState<boolean>(true);

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
    buscaItensConferenciaLista();
  }, [id, atualizaLista]);

  const navigation = useRouter();

  return (
    <div className="mx-5">
      <div className="flex flex-row justify-between py-2 self-center">
        <span className="py-2 px-2">
          {" "}
          Pedido Nº {id} | {conferencia?.Situacaoconferencia}
        </span>
        <div className="hidden lg:flex space-x-2 align-bottom ">
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
            disabled={conferencia?.Indseparacao == 9 ? false : true}
            CancelarSeparacao={CancelarSeparacao}
          />
        </div>
      </div>
      <FiltersItensPedido params={{ id }} />
      <LstItensPedido codconferencia={parseInt(id)} itens={itensConferenciaLista} loading={loading} />
    </div>
  );
}
