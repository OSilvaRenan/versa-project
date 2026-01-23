"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, SlidersVertical } from "lucide-react";

// Imports dos seus componentes customizados
import FilterCliente from "@/app/Combobox/Filters/FilterCliente";
import FilterOperacao from "@/app/Combobox/Filters/FilterOperacao";
import FilterSituacao from "@/app/Combobox/Filters/FilterSituacao";
import FilterTipoPeriodo from "@/app/Combobox/Filters/FilterTipoPeriodo";
import FilterEntradaSaida from "@/app/Combobox/Filters/FilterEntradaSaida";

const Filters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [datInicio, setDatInicio] = useState("");
  const [datFim, setDatFim] = useState("");
  const [tipoperiodo, setTipoperiodo] = useState("3");
  const [indEntradaSaida, setIndEntradaSaida] = useState("1");
  const [codsituacao, setCodsituacao] = useState("0");
  const [codoperacao, setCodoperacao] = useState("");
  const [codcliente, setCodcliente] = useState("");

  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    setDatInicio(searchParams.get("datInicio") || seteDiasAtras);
    setDatFim(searchParams.get("datFim") || hoje);
    setTipoperiodo(searchParams.get("tipoperiodo") || "3");
    setIndEntradaSaida(searchParams.get("indEntradaSaida") || "1");
    setCodsituacao(searchParams.get("codsituacao") || "0");
    setCodoperacao(searchParams.get("codoperacao") || "");
    setCodcliente(searchParams.get("codcliente") || "");
  }, [searchParams]);

  const handlePesquisa = () => {
    const params = new URLSearchParams();

    if (datInicio) params.set("datInicio", datInicio);
    if (datFim) params.set("datFim", datFim);
    if (tipoperiodo) params.set("tipoperiodo", tipoperiodo);
    if (indEntradaSaida) params.set("indEntradaSaida", indEntradaSaida);

    if (codsituacao !== "-1" && codsituacao !== "") {
      params.set("codsituacao", codsituacao);
    }
    if (codoperacao && codoperacao !== "-1" && codoperacao !== "0") {
      params.set("codoperacao", codoperacao);
    }
    if (codcliente && codcliente !== "-1" && codcliente !== "0") {
      params.set("codcliente", codcliente);
    }

    params.set("pg", "1");

    router.push(`/paginas/conferencia?${params.toString()}`);
  };

  return (
    <div >
      {/* Título e Botões principais */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Consulta Conferência</h1>
        <Button variant="default" onClick={handlePesquisa}>
          <Search className="mr-2 h-4 w-4" />
          Pesquisar
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Filtros principais */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Tipo Período */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tipoperiodo">Tipo Período:</Label>
              <FilterTipoPeriodo
                value={tipoperiodo}
                onSelect={setTipoperiodo}
                width={"120px"}
              />
            </div>

            {/* Data Início */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="datInicio">Data Início:</Label>
              <Input
                type="date"
                id="datInicio"
                className="h-9 w-40"
                value={datInicio}
                onChange={(e) => setDatInicio(e.target.value)}
              />
            </div>

            {/* Data Fim */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="datFim">Data Fim:</Label>
              <Input
                type="date"
                id="datFim"
                className="h-9 w-40"
                value={datFim}
                onChange={(e) => setDatFim(e.target.value)}
              />
            </div>

            {/* Situação */}
            <div className="flex flex-col gap-1.5">
              <FilterSituacao
                classNameCombo="w-[160px] h-9"
                value={codsituacao === "" ? 0 : parseInt(codsituacao)}
                onSelect={(val: any) => setCodsituacao(val.toString())}
              />
            </div>
          </div>

          {/* Indicadores e Botão de Expandir Filtros */}
          <div className="flex items-center gap-4">
            <div className="flex text-sm font-medium">
              <span className="px-4 h-9 flex items-center rounded-l-lg border border-input border-r-0 bg-background">
                Entrada: <strong className="ml-2 text-primary">0</strong>
              </span>
              <span className="px-4 h-9 flex items-center rounded-r-lg border border-input bg-background">
                Saída: <strong className="ml-2 text-primary">30</strong>
              </span>
            </div>

            <Button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              variant="outline"
              className="h-9"
            >
              <SlidersVertical className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Filtros adicionais */}
        {showMoreFilters && (
          <div className="flex flex-wrap items-end gap-4">
            {/* Entrada/Saída */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="entradaSaida">Entrada/Saída:</Label>
              <FilterEntradaSaida
                value={indEntradaSaida}
                onSelect={setIndEntradaSaida}
                width={"120px"}
              />
            </div>

            {/* Operação */}
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <FilterOperacao
                classNameCombo="w-[338px] h-9"
                classNameLista="lg:w-[360px] w-[300px] p-0"
                value={codoperacao}
                onSelect={setCodoperacao}
              />
            </div>

            {/* Cliente */}
            <div className="flex flex-col gap-1.5">
              <FilterCliente
                classNameCombo="w-[338px] h-9"
                classNameLista="lg:w-[340px] w-[300px] p-0"
                value={codcliente}
                onSelect={setCodcliente}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
