import { axiosWrapper } from "@/app/api/axios";
import { EditoraDTO } from "@/app/paginas/editora/EditoraDTO";

export async function CadastroEditora(request: EditoraDTO) {
    try {
        await axiosWrapper(`api/produto/editora/cadastro`, "POST", request);
       
    } catch (error) {
        console.error('', error);
        throw error;
    }
}

