"use client"

import { Button } from '@/components/ui/button';
import { ListaCaixasConferencia, ListaDadosConferencia, ListaLeituraItensConferencia, ListaProdutosConferencia } from '@/dbs/ConferenciaDb';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { conferenciaCaixasResponseDTO, conferenciaItensResponseDTO, conferenciaProdutoResponseDTO, ConferenciaResponseDTO } from '../../../../DTO/ConferenciaDTO';
import { FiltersItensPedido } from './_components/FiltersItensPedido';
import { LstItensPedido } from './LstItensPedido';
import { useConferencia } from './_components/ConferenciaContext';


interface Props {
    params: Promise<{ id: string }>;
}

const situacoesInvalidas = ["Finalizado", "Cancelado", "Em Onda", "Em Separação"];

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
        const dadosConferencia: ConferenciaResponseDTO = await ListaDadosConferencia(id);
        if (dadosConferencia) {
            SetDadosConferencia(dadosConferencia);
        }
    }

    const buscaItensConferencia = async () => {
        const itensConferencia: conferenciaItensResponseDTO[] = await ListaLeituraItensConferencia(id);
        if (itensConferencia) {
            SetItensConferencia(itensConferencia);
        }
    }

    const buscaProdutosConferencia = async () => {
        const produtosConferencia: conferenciaProdutoResponseDTO[] = await ListaProdutosConferencia(id);
        if (produtosConferencia) {
            SetProdutosConferencia(produtosConferencia);
        }
    }

    const buscaCaixasConferencia = async () => {
        const caixasConferencia: conferenciaCaixasResponseDTO[] = await ListaCaixasConferencia(id);
        if (caixasConferencia) {
            SetCaixasConferencia(caixasConferencia);
        }
    }

    const AtualizaListas = () => {
        buscaDadosConferencia();
        buscaItensConferencia();
        buscaProdutosConferencia();
        buscaCaixasConferencia();
    }

    useEffect(() => {
        AtualizaListas();
    }, [id, atualizaLista]);

    const navigation = useRouter();

    const exibirBtnLeitura = !situacoesInvalidas.includes(conferencia?.Situacaoconferencia ?? "");

    return (
        <div className='mx-5'>
            <div className="flex flex-row justify-between self-center pb-5">
                <span className='self-center'> Pedido Nº {id} | {conferencia?.Situacaoconferencia}</span>
                <div className='hidden lg:flex space-x-2 align-bottom '>
                    {exibirBtnLeitura && <Button variant="default" onClick={ReiniciaLeitura} >Reinicializar Leitura </Button>}
                    <Button variant="secondary"
                        onClick={() => navigation.back()}
                        type="button">Voltar</Button>
                </div>
            </div>
            <FiltersItensPedido params={{ id }} />
            <LstItensPedido exibirBtnLeitura={exibirBtnLeitura} />
        </div>
    );
};