import { ConferenciaRequestDTO } from "@/DTO/ConferenciaDTO";
import { pesquisaConferencias } from "@/dbs/ConferenciaFetch";
import Filters from "./filters";
import TableConferencia from "./table";

interface Props {
  params: Promise<{ conferencia: string }>;
  searchParams: Promise<any>;
}

export default async function Page({ params, searchParams }: Props) {
  const { conferencia } = await params;
  const sParams = await searchParams;

  const isEntrada = sParams.entrada === "1";

  const hoje = new Date().toISOString().split("T")[0];
  const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const situacaoRaw = sParams.codsituacao;
  let situacaoFinal: number | null = null;

  if (situacaoRaw === undefined) {
    situacaoFinal = 0;
  } else if (situacaoRaw !== "-1") {
    situacaoFinal = Number(situacaoRaw);
  } else {
    situacaoFinal = null;
  }

  const converterParaData = (
    valor: string | undefined | null,
    padrao: string,
  ): Date => {
    const dataStr = valor || padrao;
    return new Date(dataStr + "T00:00:00");
  };

  const request: ConferenciaRequestDTO = {
    PeriodoInicial: converterParaData(sParams.datInicio, seteDiasAtras),
    PeriodoFinal: converterParaData(sParams.datFim, hoje),
    Codoperacao:
      sParams.codoperacao && sParams.codoperacao !== "-1"
        ? parseInt(sParams.codoperacao)
        : 0,
    Codsituacao: situacaoFinal,
    Indseparacao:
      sParams.indseparacao && sParams.indseparacao !== "-1"
        ? parseInt(sParams.indseparacao)
        : -1,
    Codcliente:
      sParams.codcliente && sParams.codcliente !== "-1"
        ? parseInt(sParams.codcliente)
        : 0,
    IndEntradaSaida: isEntrada
      ? 1
      : sParams.indEntradaSaida
        ? parseInt(sParams.indEntradaSaida)
        : 0,
    PeriodoTipo: sParams.tipoperiodo ? parseInt(sParams.tipoperiodo) : 3,
    Codconferencia: sParams.codConferencia
      ? parseInt(sParams.codConferencia)
      : 0,
    Codempresa: sParams.codempresa ? parseInt(sParams.codempresa) : 0,
    Page: {
      RecordsCount: 0,
      PageIndex: sParams.pg ? parseInt(sParams.pg) : 1,
      PageSize: 10,
    },
  };

  const lstConferencias = await pesquisaConferencias(request);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 space-y-4">
      <Filters filtroEntrada={isEntrada ? 1 : 0} />
      <TableConferencia
        data={lstConferencias.Dados}
        page={lstConferencias.Page}
        rota={isEntrada ? `${conferencia}?entrada=1` : conferencia}
      />
    </div>
  );
}