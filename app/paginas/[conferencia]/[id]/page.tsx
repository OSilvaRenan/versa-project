"use client";

import { Button } from "@/components/ui/button";
import {
  ListaCaixasConferencia,
  ListaDadosConferencia,
  ListaLeituraItensConferencia,
  ListaProdutosConferencia,
} from "@/dbs/ConferenciaDb";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import {
  conferenciaCaixasResponseDTO,
  conferenciaItensResponseDTO,
  conferenciaProdutoResponseDTO,
  ConferenciaResponseDTO,
} from "../../../../DTO/ConferenciaDTO";
import { FiltersItensPedido } from "./_components/FiltersItensPedido";
import { LstItensPedido } from "./LstItensPedido";
import { useConferencia } from "./_components/ConferenciaContext";
import { Indseparacao } from "@/DTO/ConferenciaListaDto";

interface Props {
  params: Promise<{ id: string }>;
}

const situacoesInvalidas = [
  Indseparacao.Finalizado,
  Indseparacao.Cancelado,
  Indseparacao.EmOnda,
  Indseparacao.EmSeparacao,
];


export default function ConferenciaPage({ params }: Props) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [atualizaLista, setAtualizaLista] = useState<boolean>(true);

  const {
    SetDadosConferencia,
    SetItensConferencia,
    SetProdutosConferencia,
    SetCaixasConferencia,
    ReiniciaLeitura,
    conferencia,
  } = useConferencia();

  const buscaDadosConferencia = async () => {
    const dadosConferencia: ConferenciaResponseDTO =
      await ListaDadosConferencia(id);
    if (dadosConferencia) {
      SetDadosConferencia(dadosConferencia);
    }
  };

  const buscaItensConferencia = async () => {
    const itensConferencia: conferenciaItensResponseDTO[] =
      await ListaLeituraItensConferencia(id);
    if (itensConferencia) {
      SetItensConferencia(itensConferencia);
    }
  };

  const buscaProdutosConferencia = async () => {
    const produtosConferencia: conferenciaProdutoResponseDTO[] =
      await ListaProdutosConferencia(id);
    if (produtosConferencia) {
      SetProdutosConferencia(produtosConferencia);
    }
  };

  const buscaCaixasConferencia = async () => {
    const caixasConferencia: conferenciaCaixasResponseDTO[] =
      await ListaCaixasConferencia(id);
    if (caixasConferencia) {
      SetCaixasConferencia(caixasConferencia);
    }
  };

  const AtualizaListas = () => {
    buscaDadosConferencia();
    buscaItensConferencia();
    buscaProdutosConferencia();
    buscaCaixasConferencia();
  };

  useEffect(() => {
    AtualizaListas();
  }, [id, atualizaLista]);

  const navigation = useRouter();

  const exibirBtnLeitura = !situacoesInvalidas.includes(
    conferencia?.Indseparacao as Indseparacao,
  );

  return (
      <div className="w-full max-w-[100vw] px-3 md:px-0 pb-4 overflow-x-hidden box-border">
        {/* HEADER */}
        <div className="flex flex-nowrap w-full items-center justify-between gap-3 mb-4 md:mb-3">
          <h1 className="flex-1 text-sm lg:text-lg font-bold md:text-xl truncate min-w-0">
            Pedido Nº {id} | {conferencia?.Situacaoconferencia}
          </h1>
          {exibirBtnLeitura && (
            <Button variant="default" onClick={ReiniciaLeitura} className="shrink-0 lg:h-9 text-xs md:h-10 md:px-4 md:text-sm ">
              Reinicializar Leitura
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
        <LstItensPedido exibirBtnLeitura={exibirBtnLeitura} />
      </div>
  );
}
