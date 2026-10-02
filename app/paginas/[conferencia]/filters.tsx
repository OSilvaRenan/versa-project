"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, RotateCw, SlidersVertical, X } from "lucide-react";
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

  const [codConferencia, setCodConferencia] = useState(
    searchParams.get("codConferencia") || "",
  );
  const [datInicio, setDatInicio] = useState(
    searchParams.get("datInicio") || seteDiasAtras,
  );
  const [datFim, setDatFim] = useState(searchParams.get("datFim") || hoje);
  const [tipoperiodo, setTipoperiodo] = useState(
    searchParams.get("tipoperiodo") || "3",
  );
  const [indEntradaSaida, setIndEntradaSaida] = useState(
    searchParams.get("indEntradaSaida") || filtroEntrada?.toString() || "0",
  );

  const [codsituacao, setCodsituacao] = useState(() => {
    const param = searchParams.get("codsituacao");
    if (param === "-1") return "";
    if (param === null) return "0";
    return param;
  });

  const [indseparacao, setIndseparacao] = useState(
    searchParams.get("indseparacao") || "-1",
  );
  const [codoperacao, setCodoperacao] = useState(
    searchParams.get("codoperacao") || "",
  );
  const [codcliente, setCodcliente] = useState(
    searchParams.get("codcliente") || "",
  );
  const [codempresa, setCodempresa] = useState(
    searchParams.get("codempresa") || "",
  );
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleToggleSituacao = (valor: string) => {
    setCodsituacao((prev) => {
      const novoValor = prev === valor ? "" : valor;
      if (novoValor !== "") setIndseparacao("-1");
      return novoValor;
    });
  };

  const handleClearAllFilters = () => {
    setCodConferencia("");
    setDatInicio(seteDiasAtras);
    setDatFim(hoje);
    setTipoperiodo("3");
    setIndEntradaSaida(filtroEntrada?.toString() || "0");
    setCodsituacao("0");
    setIndseparacao("-1");
    setCodoperacao("");
    setCodcliente("");
    setCodempresa(codEmpresaPadrao);
    router.push(pathname);
  };

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
  }, [
    pathname,
    hoje,
    seteDiasAtras,
    searchParams,
    filtroEntrada,
    codEmpresaPadrao,
    router,
  ]);

  const handlePesquisa = () => {
    const params = new URLSearchParams();

    const currentEntrada = searchParams.get("entrada");
    if (currentEntrada) params.set("entrada", currentEntrada);
    if (codConferencia) params.set("codConferencia", codConferencia);

    params.set("datInicio", datInicio);
    params.set("datFim", datFim);
    params.set("tipoperiodo", tipoperiodo);
    params.set("indEntradaSaida", indEntradaSaida);
    params.set("indseparacao", indseparacao);
    params.set("codsituacao", codsituacao !== "" ? codsituacao : "-1");

    if (codoperacao && codoperacao !== "-1" && codoperacao !== "0")
      params.set("codoperacao", codoperacao);
    if (codcliente && codcliente !== "-1" && codcliente !== "0")
      params.set("codcliente", codcliente);
    if (codempresa && codempresa !== "" && codempresa !== "0")
      params.set("codempresa", codempresa);

    params.set("pg", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-4">
      {/* empresa-header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Conferências {filtroEntrada === 1 ? "Entrada" : ""}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="h-9 "
          >
            <SlidersVertical className="mr-1.5 h-7 w-4" /> Mais Filtros
          </Button>
        </div>
      </div>

      {/* empresa-filters */}
      <div className="bg-card border rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 min-w-45">
            <Label className="text-sm font-semibold text-gray-700">
              Cód. Conferência:
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Digite o código..."
                className="h-7 text-sm"
                value={codConferencia}
                onChange={(e) => setCodConferencia(e.target.value)}
              />
              {codConferencia && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCodConferencia("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 h-6"
                >
                  <X className="h-2 w-2" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 min-w-40">
            <Label className="text-sm font-semibold text-gray-700">
              Tipo Período:
            </Label>
            <FilterTipoPeriodo
              value={tipoperiodo}
              onSelect={setTipoperiodo}
              width={"100%"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              Data Início:
            </Label>
            <Input
              type="date"
              className="h-7 text-sm"
              value={datInicio}
              onChange={(e) => setDatInicio(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              Data Fim:
            </Label>
            <Input
              type="date"
              className="h-7 text-sm"
              value={datFim}
              onChange={(e) => setDatFim(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
            <Button
              onClick={handlePesquisa}
              className="primary px-4 py-2 font-medium h-7"
            >
              <Search className="mr-1.5 h-4 w-4" /> Pesquisar
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              variant="secondary"
              onClick={handleClearAllFilters}
              className="h-7"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {showMoreFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Entrada/Saída:
              </Label>
              <FilterEntradaSaida
                value={indEntradaSaida}
                onSelect={setIndEntradaSaida}
                width={"100%"}
              />
            </div>
            <div className="flex flex-col ">
              <FilterSituacao
                classNameCombo="h-7 w-full"
                value={parseInt(indseparacao)}
                onSelect={(val: any) => setIndseparacao(val.toString())}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FilterOperacao
                classNameCombo="h-7 w-full"
                value={codoperacao}
                onSelect={setCodoperacao}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FilterCliente
                classNameCombo="h-7 w-full"
                value={codcliente}
                onSelect={setCodcliente}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <FilterEmpresa
                classNameCombo="h-7 w-full"
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
