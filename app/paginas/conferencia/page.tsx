import { ConferenciaRequestDTO } from "@/DTO/ConferenciaDTO";
import { pesquisaConferencias } from "@/dbs/ConferenciaFetch";
import Filters from "./filters";
import TableConferencia from "./table";

// 1. AS DATAS AQUI DEVEM SER STRING (Pois vêm da URL)
export interface searchQuery {
  datInicio?: string; 
  datFim?: string;
  tipoperiodo?: string;
  indEntradaSaida?: string;
  codsituacao?: string;
  codoperacao?: string;
  codcliente?: string;
  pg?: string;
  codconferencia?: string;
}

interface Props {
  searchParams: Promise<searchQuery>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const listaConferencias = async () => {
    
    const converterParaData = (valor: string | undefined | null, padrao: Date): Date => {
      if (!valor) return padrao;
      const d = new Date(valor + "T00:00:00");
      return isNaN(d.getTime()) ? padrao : d;
    };

    const request: ConferenciaRequestDTO = {
      PeriodoInicial: converterParaData(
        params.datInicio, 
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ),

      PeriodoFinal: converterParaData(
        params.datFim, 
        new Date()
      ),

      Codoperacao: (params.codoperacao && params.codoperacao !== "-1")
        ? parseInt(params.codoperacao)
        : 0,

      Codsituacao: (params.codsituacao && params.codsituacao !== "-1")
        ? parseInt(params.codsituacao)
        : -1,

      Codcliente: (params.codcliente && params.codcliente !== "-1")
        ? parseInt(params.codcliente)
        : 0,

      IndEntradaSaida: params.indEntradaSaida
        ? parseInt(params.indEntradaSaida)
        : 1,

      PeriodoTipo: params.tipoperiodo ? parseInt(params.tipoperiodo) : 0,

      Codconferencia: params.codconferencia
        ? parseInt(params.codconferencia)
        : 0,

      Page: {
        RecordsCount: 0,
        PageIndex: params.pg ? parseInt(params.pg) : 1,
        PageSize: 10,
      },
    };

    return await pesquisaConferencias(request);
  };

  const lstConferencias = await listaConferencias();

  return (
    <div className="space-y-6">
      <Filters />
      <TableConferencia 
        data={lstConferencias.Dados} 
        page={lstConferencias.Page} 
        rota={"conferencia"} 
      />
    </div>
  );
}