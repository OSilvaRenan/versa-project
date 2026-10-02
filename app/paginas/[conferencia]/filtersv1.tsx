"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, SlidersVertical, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import FilterCliente from "@/app/Combobox/Filters/FilterCliente";
import FilterEntradaSaida from "@/app/Combobox/Filters/FilterEntradaSaida";
import FilterOperacao from "@/app/Combobox/Filters/FilterOperacao";
import FilterSituacao from "@/app/Combobox/Filters/FilterSituacao";
import FilterTipoPeriodo from "@/app/Combobox/Filters/FilterTipoPeriodo";
import FilterEmpresa from "@/app/Combobox/Filters/FilterEmpresa";

interface searchQuery {
  filtroEntrada?: number;
}

const Filters = ({ filtroEntrada }: searchQuery) => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useRef(false);
  const usuario = session?.user as any;
  const listaEmpresasSessao = usuario?.LstEmpresas || [];
  const codEmpresaPadrao = usuario?.Codempresa?.toString() || "";

  const hoje = new Date().toISOString().split("T")[0];
  const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [codConferencia, setCodConferencia] = useState(searchParams.get("codConferencia") || "");
  const [datInicio, setDatInicio] = useState(searchParams.get("datInicio") || seteDiasAtras);
  const [datFim, setDatFim] = useState(searchParams.get("datFim") || hoje);
  const [tipoperiodo, setTipoperiodo] = useState(searchParams.get("tipoperiodo") || "3");
  const [indEntradaSaida, setIndEntradaSaida] = useState(searchParams.get("indEntradaSaida") || filtroEntrada?.toString() || "0");

  const [codsituacao, setCodsituacao] = useState(() => {
    const param = searchParams.get("codsituacao");
    if (param === "-1") return "";
    if (param === null) return "0";
    return param;
  });

  const [indseparacao, setIndseparacao] = useState(searchParams.get("indseparacao") || "-1");
  const [codoperacao, setCodoperacao] = useState(searchParams.get("codoperacao") || "");
  const [codcliente, setCodcliente] = useState(searchParams.get("codcliente") || "");
  const [codempresa, setCodempresa] = useState(searchParams.get("codempresa") || "");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleToggleSituacao = (valor: string) => {
    setCodsituacao((prev) => {
      const novoValor = prev === valor ? "" : valor;
      if (novoValor !== "") setIndseparacao("-1");
      return novoValor;
    });
  };

  const handleClearCod = () => setCodConferencia("");

  useEffect(() => {
    if (!isInitialized.current) {
      const params = new URLSearchParams(window.location.search);
      let changed = false;

      if (!searchParams.get("datInicio")) {
        params.set("datInicio", seteDiasAtras);
        params.set("datFim", hoje);
        params.set("tipoperiodo", "3");
        params.set("indEntradaSaida", filtroEntrada?.toString() || "0");
        if (!searchParams.has("codsituacao")) params.set("codsituacao", "0");
        params.set("indseparacao", "-1");
        params.set("pg", searchParams.get("pg") || "1");
        changed = true;
      }

      if (!searchParams.get("codempresa") && codEmpresaPadrao) {
        params.set("codempresa", codEmpresaPadrao);
        setCodempresa(codEmpresaPadrao);
        changed = true;
      }

      if (changed) {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
      isInitialized.current = true;
    }
  }, [pathname, hoje, seteDiasAtras, searchParams, filtroEntrada, codEmpresaPadrao, router]);

  const handlePesquisa = () => {
    const params = new URLSearchParams();

    // Mantém o parâmetro 'entrada' se ele existir na URL atual
    const currentEntrada = searchParams.get("entrada");
    if (currentEntrada) {
      params.set("entrada", currentEntrada);
    }

    if (codConferencia) params.set("codConferencia", codConferencia);
    params.set("datInicio", datInicio);
    params.set("datFim", datFim);
    params.set("tipoperiodo", tipoperiodo);
    params.set("indEntradaSaida", indEntradaSaida);
    params.set("indseparacao", indseparacao);

    if (codsituacao !== "") {
      params.set("codsituacao", codsituacao);
    } else {
      params.set("codsituacao", "-1");
    }

    if (codoperacao && codoperacao !== "-1" && codoperacao !== "0") params.set("codoperacao", codoperacao);
    if (codcliente && codcliente !== "-1" && codcliente !== "0") params.set("codcliente", codcliente);
    if (codempresa && codempresa !== "" && codempresa !== "0") params.set("codempresa", codempresa);

    params.set("pg", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-[100vw] px-3 md:px-0 pb-4 overflow-x-hidden box-border">
      <div className="flex flex-nowrap w-full items-center justify-between gap-3 mb-4 md:mb-3">
        <h1 className="flex-1 text-lg font-bold md:text-xl truncate min-w-0">
          Consulta Conferência {filtroEntrada === 1 ? "Entrada" : ""}
        </h1>
        <Button
          variant="default"
          onClick={handlePesquisa}
          className="shrink-0 lg:h-9 text-xs md:h-10 md:px-4 md:text-sm"
        >
          <Search className="lg:mr-2 h-3 w-3 md:h-4 md:w-4" />
          Pesquisar
        </Button>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4 w-full md:flex-row md:flex-wrap md:items-end md:gap-2">
          <div className="flex flex-col gap-0.5 md:gap-0.5 w-full md:w-auto">
            <Label htmlFor="codconferencia">Cod:</Label>
            <div className="relative w-full md:w-40">
              <Input
                type="text"
                id="codconferencia"
                className="h-7 w-full px-2 pr-7 text-xs"
                value={codConferencia}
                onChange={(e) => setCodConferencia(e.target.value)}
              />
              {codConferencia && (
                <button
                  type="button"
                  onClick={handleClearCod}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-0.5 md:gap-0.5 w-full md:w-auto">
            <Label htmlFor="tipoperiodo">Tipo Período:</Label>
            <FilterTipoPeriodo value={tipoperiodo} onSelect={setTipoperiodo} width={"100%"} />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:flex md:w-auto md:gap-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <Label htmlFor="datInicio">Data Início:</Label>
              <Input
                type="date"
                id="datInicio"
                className="h-7 w-full md:w-40 px-2 text-xs"
                value={datInicio}
                onChange={(e) => setDatInicio(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <Label htmlFor="datFim">Data Fim:</Label>
              <Input
                type="date"
                id="datFim"
                className="h-7 w-full md:w-40 px-2 text-xs"
                value={datFim}
                onChange={(e) => setDatFim(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 whitespace-nowrap">
            <div className="flex text-xs">
              <Label
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleToggleSituacao("0");
                }}
                className={`cursor-pointer px-3 h-7 w-24 flex items-center rounded-l-lg border border-r-0 ${codsituacao === "0" ? "font-bold bg-primary text-white" : "dark:bg-card"}`}
              >
                Em Aberto
              </Label>
              <Label
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleToggleSituacao("1");
                }}
                className={`cursor-pointer w-20 px-3 h-7 flex items-center rounded-r-lg border ${codsituacao === "1" ? "font-bold bg-primary text-white" : "dark:bg-card"}`}
              >
                Fechado
              </Label>
            </div>
          </div>

          <Button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            variant="outline"
            className="w-full h-7 md:w-auto"
          >
            <SlidersVertical className="lg:mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>

        {showMoreFilters && (
          <div className="flex flex-col gap-4 w-full md:flex-row md:flex-wrap md:items-end md:gap-2">
            <div className="flex flex-col gap-0.5 w-full md:w-auto">
              <Label htmlFor="entradaSaida">Entrada/Saída:</Label>
              <FilterEntradaSaida value={indEntradaSaida} onSelect={setIndEntradaSaida} width={"100%"} />
            </div>
            <div className="flex flex-col gap-0.5 w-full md:w-auto">
              <FilterSituacao
                classNameCombo="w-full h-7 md:w-[160px]"
                value={parseInt(indseparacao)}
                onSelect={(val: any) => {
                  const stringVal = val.toString();
                  setIndseparacao(stringVal);
                  if (stringVal !== "-1") setCodsituacao("");
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:gap-0.5 w-full md:w-auto lg:col-span-2">
              <FilterOperacao
                classNameCombo="w-full h-7 md:w-[328px] md:h-7"
                value={codoperacao}
                onSelect={setCodoperacao}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:gap-0.5 w-full md:w-auto">
              <FilterCliente
                classNameCombo="w-full h-7 md:w-[328px] md:h-7"
                value={codcliente}
                onSelect={setCodcliente}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:gap-0.5 w-full md:w-auto">
              <FilterEmpresa
                classNameCombo="w-full h-7 md:w-[328px] md:h-7"
                value={codempresa}
                listaEmpresas={listaEmpresasSessao}
                onSelect={setCodempresa}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;