
export interface ConferenciaListaResponseDTO {
  Codproduto: number;
  Isbn: string;
  Nomproduto: string;
  Quantidade: number;
  QuantidadeOk: number;
  QuantidadeDanificada: number;
  Localizacao?: string;
  Indseparacao?: number;
}

export interface ConferenciaListaAtualizaQtdDTO {
  Codproduto: number;
  NovaQtd: number;
  IndTipoQtd: TipoQuantidade;
}

export enum TipoQuantidade {
  qtdOk = "qtdOk",
  qtdDanificada = "qtdDanificada",
}

export enum Indseparacao {
Pendente = 0,
EmConferencia = 1,
Finalizado = 2,
Cancelado = 3,
EmElaboracao = 4,
Divergente = 5,
SeparacaoIntegrada = 6,
EmPausa = 8,
EmSeparacao = 9,
ProntaParaConferencia = 10,
ComProblemasdeMovimentacao = 11,
EmOnda = 12,
DivergenciaSeparacao = 13,
EmGuarda = 14,
ProblemaNaIntegracao = 15,
}