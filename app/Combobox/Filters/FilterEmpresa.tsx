"use client"
import { useEffect, useState } from 'react';
import { CboDinamica } from '../CboDinamica';
import { CboData } from '../CboEstatica';

interface Props {
    classNameCombo?: string;
    classNameLista?: string;
    value: string;
    listaEmpresas: any[]; // <-- Nova prop recebida do pai
    onSelect: (value: string) => void
}

const FilterEmpresa = ({ classNameCombo, classNameLista, value, listaEmpresas, onSelect }: Props) => {
    const [data, setData] = useState<CboData[]>([]);
    const [itemListaSelecionado, setItemListaSelecionado] = useState<CboData>({ 
        Value: value?.toString() || '', 
        Description: '' 
    });

    useEffect(() => {
        if (value && listaEmpresas.length > 0) {
            const empresa = listaEmpresas.find((e: any) => e.Codempresa.toString() === value.toString());
            if (empresa) {
                setItemListaSelecionado({ Value: empresa.Codempresa.toString(), Description: empresa.Nomempresa });
                setData([{ Value: empresa.Codempresa.toString(), Description: empresa.Nomempresa }]);
            }
        } else if (!value) {
            setItemListaSelecionado({ Value: '', Description: '' });
            setData([]);
        }
    }, [value, listaEmpresas]);

    const carregarOpcoes = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const termo = event.target.value.toLowerCase();
            const filtrados = listaEmpresas
                .filter((emp: any) => emp.Nomempresa.toLowerCase().includes(termo))
                .map((item: any) => ({
                    Value: item.Codempresa.toString(),
                    Description: item.Nomempresa
                }));
            setData(filtrados);
        }
    };

    return (
        <CboDinamica 
            classNameCombo={classNameCombo} 
            classNameLista={classNameLista}
            label='Empresa:' 
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

export default FilterEmpresa;