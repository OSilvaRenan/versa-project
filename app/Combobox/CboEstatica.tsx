import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react"; // Removido o Check
import { useState } from "react";
import { truncateString } from "../functions/functions";

export interface CboData {
  Value: string;
  Description: string;
}

interface Props {
  classNameCombo?: string;
  classNameLista?: string;
  classeNameInput?: string;
  label?: string;
  data: CboData[];
  itemListaSelecionado?: CboData;
  mostrarValue: boolean;
  onSelect?: (value: string) => void;
  carregarOpcoes: () => void;
  setData: (value: CboData[]) => void;
  setItemListaSelecionado?: (value: CboData) => void;
}

export const CboEstatica = ({
  classNameCombo,
  classNameLista,
  classeNameInput,
  label,
  mostrarValue,
  data,
  itemListaSelecionado,
  setItemListaSelecionado,
  setData,
  carregarOpcoes,
  onSelect,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleSearch = async (event: any) => {
    const query = event.target.value.toLowerCase();
    const dados = data.filter((lista) =>
      lista.Description.toLowerCase().includes(query),
    );
    setData(dados);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      )}

      <div className="flex items-center gap-1.5">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "justify-between h-10 px-3 font-normal",
                classNameCombo ?? "w-62.5",
              )}
              onClick={carregarOpcoes}
            >
              <span className="truncate">
                {itemListaSelecionado && itemListaSelecionado.Value !== "-1"
                  ? itemListaSelecionado.Description !== ""
                    ? truncateString(itemListaSelecionado.Description, 25)
                    : (data.find(
                        (lista) =>
                          itemListaSelecionado.Value === lista.Value.toString(),
                      )?.Description ?? "Selecione...")
                  : "Selecione..."}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={4}
            avoidCollisions={false}
            className={cn(
              "p-0 w-(--radix-popover-trigger-width) min-w-50",
              classNameLista,
            )}
          >
            <Command className="w-full">
              <CommandInput
                placeholder="Buscar registro..."
                onInput={handleSearch}
              />
              <CommandEmpty>Nenhum registro encontrado.</CommandEmpty>
              <CommandGroup className="max-h-75 overflow-y-auto">
                {data.map((lista) => {
                  const isSelected =
                    itemListaSelecionado?.Value === lista.Value.toString();

                  return (
                    <CommandItem
                      key={lista.Value}
                      value={lista.Description}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected &&
                          "bg-accent text-accent-foreground font-semibold",
                      )}
                      onSelect={() => {
                        const newValue = isSelected
                          ? { Value: "-1", Description: "" }
                          : {
                              Value: lista.Value.toString(),
                              Description: lista.Description,
                            };

                        if (setItemListaSelecionado)
                          setItemListaSelecionado(newValue);
                        if (onSelect) onSelect(newValue.Value);
                        setOpen(false);
                      }}
                    >
                      {lista.Description}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {mostrarValue && (
          <Input
            type="text"
            readOnly
            value={
              itemListaSelecionado && itemListaSelecionado.Value !== "-1"
                ? itemListaSelecionado.Value
                : ""
            }
            className={cn("w-16 h-9 text-center bg-muted", classeNameInput)}
          />
        )}
      </div>
    </div>
  );
};
