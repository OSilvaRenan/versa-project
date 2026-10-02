const axios = require("axios");

//#region GET

// Função para buscar código do produto via ISBN
export async function ObtemCodigoProduto(isbn: string): Promise<any> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}api/produto/isbn/${isbn}`;
    const response = await axios.get(url);

    if (Array.isArray(response.data) && response.data.length > 0) {

      return response.data[0].Codproduto; 
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar ListaCaixasConferencia:", error);
    throw error;
  }
}
//#endregion

// #region POST
// Função para consultar preço do produto
export async function ConsultaPreco(request: ConsultaPrecoRequestDTO) {
 
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}api/produto/consultapreco`, 
    request
  );
}

//#endregion
