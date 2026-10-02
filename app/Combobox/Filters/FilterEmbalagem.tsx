"use client"

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CboData } from '../CboEstatica';

interface EmbalagemResponse {
    Codembalagem: number;
    Dscembalagem: string;
}

interface Props {
    codconferencia: number;
    classNameCombo?: string;
    classNameLista?: string;
    value: number;
    onSelect: (value: string) => void;
    setEmbalagem: (value: CboData) => void;
    disabled?: boolean; 
}

const FilterEmbalagem = ({ 
    value, 
    onSelect, 
    setEmbalagem, 
    disabled = false 
}: Props) => {

    const [data, setData] = useState<CboData[]>([]);
    const [itemListaSelecionado, setItemListaSelecionado] = useState<CboData>({ 
        Value: value.toString(), 
        Description: '' 
    });

    const carregarOpcoes = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/conferencia/embalagem`);

            const dadosTransformados: CboData[] = response.data.map((item: EmbalagemResponse) => ({
                Value: item.Codembalagem.toString(),
                Description: item.Dscembalagem
            }));

            setData(dadosTransformados);
            
            const itemInicial = dadosTransformados.find(item => item.Value === value.toString());
            if (itemInicial) {
                setItemListaSelecionado(itemInicial);
            } else if (dadosTransformados.length > 0) {
                const defaultItem = dadosTransformados[0];
                setItemListaSelecionado(defaultItem);
                setEmbalagem(defaultItem);
                onSelect(defaultItem.Value);
            }
        } catch (erro) {
            console.error('Erro ao carregar opções:', erro);
        }
    };

    useEffect(() => {
        carregarOpcoes();
    }, [value]);

    return (
      <div className="flex flex-col w-full">
            <Label className="py-2" htmlFor="cboembalagem">Embalagem:</Label>
            
            <Select 
                disabled={disabled} 
                value={itemListaSelecionado.Value} 
                onValueChange={(selectedValue: string) => {
                    const selectedItem = data.find(item => item.Value === selectedValue);
                    if (selectedItem) {
                        setItemListaSelecionado(selectedItem);
                        onSelect(selectedValue);
                        setEmbalagem(selectedItem); 
                    }
                }}
            >
                <SelectTrigger className="h-7 lg:w-48.75 w-77" id="cboembalagem">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {data.map((embalagem) => (
                        <SelectItem key={embalagem.Value} value={embalagem.Value}>
                            {embalagem.Description}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FilterEmbalagem;