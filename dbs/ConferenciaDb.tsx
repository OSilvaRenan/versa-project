import { axiosWrapper } from "@/app/api/axios";
import { toast } from "@/components/ui/use-toast";
import {
  conferenciaCaixasResponseDTO,
  conferenciaItensResponseDTO,
  ConferenciaListaProcessaRequestDTO,
  ConferenciaListaProcessaResponseDTO,
  conferenciaProdutoResponseDTO,
  ConferenciaResponseDTO,
  RegistraCaixaRequest,
  RegistraLeituraRequest,
  RegistraPesoRequest,
} from "@/DTO/ConferenciaDTO";
import { ConferenciaListaAtualizaQtdDTO } from "@/DTO/ConferenciaListaDto";
import { ok } from "assert";

//#region GET

// Função para buscar os dados de uma conferência específica
export async function ListaDadosConferencia(
  codconferencia: number | string,
): Promise<ConferenciaResponseDTO> {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}`,
      "GET",
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ListaDadosConferencia:", error);
    throw error;
  }
}

// Função para buscar leituras realizadas de uma conferência específica
export async function ListaLeituraItensConferencia(
  codconferencia: number | string,
): Promise<conferenciaItensResponseDTO[]> {
  try {
    // const url = `${process.env.NEXT_PUBLIC_API_URL}api/conferencia/${codconferencia}/itens`;
    // const response = await axios.get(url);
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/itens`,
      "GET",
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ListaLeituraItensConferencia:", error);
    throw error;
  }
}

// Função para buscar produtos de uma conferência específica
export async function ListaProdutosConferencia(
  codconferencia: number | string,
): Promise<conferenciaProdutoResponseDTO[]> {
  try {
    // const url = `${process.env.NEXT_PUBLIC_API_URL}api/conferencia/${codconferencia}/separacao/produtos`;
    // const response = await axios.get(url);
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/separacao/produtos`,
      "GET",
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ListaProdutosConferencia:", error);
    throw error;
  }
}

// Função para buscar caixas de uma conferência específica
export async function ListaCaixasConferencia(
  codconferencia: number | string,
): Promise<conferenciaCaixasResponseDTO[]> {
  try {
    // const url = `${process.env.NEXT_PUBLIC_API_URL}api/conferencia/${codconferencia}/caixas`;
    // const response = await axios.get(url);
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/caixas`,
      "GET",
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ListaCaixasConferencia:", error);
    throw error;
  }
}

//#endregion

//#region POST

export async function ConferenciaListaProcessa(
  codconferencia: number | string,
  request: ConferenciaListaProcessaRequestDTO,
): Promise<ConferenciaListaProcessaResponseDTO[]> {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/lista/processa`,
      "POST",
      request,
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ListaCaixasConferencia:", error);
    throw error;
  }
}

// Função para excluir leitura de uma conferência específica
export async function ExcluiLeituraConferencia(
  seqconferenciaitem: number | string,
) {
  try {
    const response = await axiosWrapper(
      `api/conferencia/excluirleitura/${seqconferenciaitem}`,
      "POST",
    );
  } catch (error) {
    console.error("Erro ao ExcluiLeituraConferencia:", error);
    throw error;
  }
}

// Função para excluir caixa de uma conferência específica
export async function ExcluiCaixaConferencia(
  codconferencia: number | string,
  nrocaixa: number | string,
): Promise<number> {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/excluircaixa/${nrocaixa}`,
      "POST",
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao ExcluiCaixaConferencia:", error);
    throw error;
  }
}

// Função para registrar caixa em uma conferência específica
export async function RegistraCaixaConferencia(
  codconferencia: number | string,
  request: RegistraCaixaRequest,
): Promise<number> {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/registracaixa`,
      "POST",
      request,
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao RegistraCaixaConferencia:", error);
    throw error;
  }
}

export async function FinalizarConferencia(
  codconferencia: number | string,
  request: ConferenciaListaProcessaRequestDTO,
) {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/finalizaconferencia`,
      "POST",
      request,
    );
  } catch (error) {
    console.error("Erro ao FinalizaConferencia:", error);
    throw error;
  }
}

export async function RegistraPesoCaixa(
  codconferencia: number | string,
  nrocaixa: number | string,
  request: RegistraPesoRequest,
): Promise<number> {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/pesocaixa/${nrocaixa}`,
      "POST",
      request,
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao RegistraPesoCaixa:", error);
    throw error;
  }
}

export async function RegistraLeitura(
  codconferencia: number | string,
  request: RegistraLeituraRequest,
): Promise<number> {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/registraleitura`,
      "POST",
      request,
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao RegistraLeitura:", error);
    throw error;
  }
}

export async function AtualizarQtdConferenciaLista(
  codconferencia: number | string,
  request: ConferenciaListaAtualizaQtdDTO[],
) {
  try {
    await axiosWrapper(
      `api/conferencia/${codconferencia}/lista/salvar`,
      "POST",
      request,
    );
  } catch (error) {
    toast({
      variant: "default",
      description: "Erro ao atualizar a quantidade separada: " + error,
    });
  }
}

export async function ConferenciaListaInicializa(
  codconferencia: number | string,
  request: ConferenciaListaProcessaRequestDTO,
): Promise<ConferenciaListaProcessaResponseDTO[]> {
  try {
    const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/lista/inicializa`,
      "POST",
      request,
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao inicializa ConferenciaLista:", error);
    throw error;
  }
}

// Função para reinicializar a conferencia lista
export async function ReinicializaConferenciaLista(
  codconferencia: number | string,
  request: ConferenciaListaProcessaRequestDTO,
) {
  try {
  const response = await axiosWrapper(
      `api/conferencia/${codconferencia}/lista/reinicializa`, 
      "POST",
      request,
    );
    return response;
  } catch (error) {
    console.error("Erro ao reinicializar conferência:", error);
    throw error;
  }
}

//#endregion
