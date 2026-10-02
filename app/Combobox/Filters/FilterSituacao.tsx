
"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CboData, CboEstatica } from '../CboEstatica';

interface SituacaoRequest {
    Nomsituacao: string;
}

interface SituacaoResponse {
    Codsituacao: number;
    Nomsituacao: string;
}

interface Props {
    classNameCombo?: string;
    classNameLista?: string;
    value: number;
    onSelect: (value: string) => void;

}

const FilterSituacao = ({ value, classNameCombo, classNameLista, onSelect }: Props) => {
    const [data, setData] = useState<CboData[]>([]);
    
    const [itemListaSelecionado, setItemListaSelecionado] = useState<CboData>({ 
        Value: value.toString(), 
        Description: '' 
    });

    const carregarOpcoes = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/situacoes`);
            const dadosTransformados: CboData[] = response.data.map((item: SituacaoResponse) => ({
                Value: item.Codsituacao.toString(), 
                Description: item.Nomsituacao
            }));

            setData(dadosTransformados);

            const selecionado = dadosTransformados.find(item => item.Value === value.toString());
            if (selecionado) {
                setItemListaSelecionado(selecionado);
            }
        } catch (erro) {
            console.error('Erro ao carregar opções:', erro);
        }
    };

    
    useEffect(() => {
        carregarOpcoes();
    }, []);

    useEffect(() => {
    if (data.length > 0) {
      
        const selecionado = data.find(item => item.Value === value.toString());
        
        if (selecionado) {
            setItemListaSelecionado(selecionado);
        } else if (value === -1) {
            setItemListaSelecionado({ Value: "-1", Description: "Selecione..." });
        }
    }
}, [value, data]);
    // useEffect(() => {
    //     if (data.length > 0) {
    //         const selecionado = data.find(item => item.Value === value.toString());
    //         if (selecionado) {
    //             setItemListaSelecionado(selecionado);
    //         }
    //     }
    // }, [value, data]);

    return (
        <CboEstatica 
            classNameCombo={classNameCombo} 
            classNameLista={classNameLista}
            label={"Situação:"} 
            data={data} 
            setData={setData}
            carregarOpcoes={carregarOpcoes} 
            mostrarValue={false}
            itemListaSelecionado={itemListaSelecionado} 
            setItemListaSelecionado={setItemListaSelecionado}
            onSelect={onSelect}
        />
    );
};

export default FilterSituacao;