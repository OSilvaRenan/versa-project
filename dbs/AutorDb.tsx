import { axiosWrapper } from "@/app/api/axios";
import { AutorDTO } from "@/DTO/AutorDTO";
import { ConsultaDuplicatasRequest, DuplicatasResponse, EnviaTokenRequest, ValidaTokenRequest, ValidaTokenResponse } from "@/DTO/ClienteDTO";

//#region GET

export async function BuscarAutor(codautor: string): Promise<AutorDTO> {
    try {
        const response = await axiosWrapper(
                  `api/produto/autor/${codautor}`,
                  "GET"
                );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Autor:', error);
        throw error;
    }
}

//#endregion

//#region POST

// Função para listar duplicatas em aberto via cnpj 

// Função para enviar token por email
export async function CadastroAutor(request: AutorDTO) {
    try {
        await axiosWrapper(`api/produto/autor/cadastro`, "POST", request);
       
    } catch (error) {
        console.error('Erro ao buscar EnviarTokenEmail:', error);
        throw error;
    }
}

// Função para validar token
export async function ValidaToken(request: ValidaTokenRequest): Promise<ValidaTokenResponse> {
    try {
        const response = await axiosWrapper(`api/cliente/consultacontas/validatoken`, "POST", request);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar EnviarTokenEmail:', error);
        throw error;
    }
}

//#endregion
