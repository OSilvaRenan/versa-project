
export interface ConferenciaListaResponseDTO {
  Codproduto: number;
  Isbn: string;
  Nomproduto: string;
  Quantidade: number;
  QuantidadeOk: number;
  QuantidadeDanificada: number;
  Localizacao?: string;
}

export interface ConferenciaListaAtualizaQtdDTO {
  Codproduto: number;
  QuantidadeOk: number;
  QuantidadeDanificada: number;
}