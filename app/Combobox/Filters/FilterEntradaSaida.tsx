
"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    width: string;
    value: string;
    onSelect: (value: string) => void
}

const FilterEntradaSaida = ({ value, onSelect }: Props) => {

    const tiposEntradaSaida = [
        { id: "0", label: "Todas" },
        { id: "1", label: "Entrada" },
        { id: "2", label: "Saída" },
    ]

    return (
        <Select value={value} onValueChange={(selectedValue) => { onSelect(selectedValue) }}>
            <SelectTrigger className="h-7 w-40 min-w-full max-w-full" id="tipoperiodo" name="tipoperiodo" >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {tiposEntradaSaida.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>{tipo.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>

    );
};

export default FilterEntradaSaida;