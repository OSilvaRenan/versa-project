import React from 'react';

// 1. Defina a estrutura dos dados que vêm do C#
interface EstoqueAlmoxarifado {
  codempresa: number;
  codalmoxarifado: number;
  nomeAlmoxarifado: string;
  produto: string;
  quantidade: number;
}

// Configuração opcional: define de quanto em quanto tempo o Next.js deve atualizar esses dados
// revalidate: 60 significa que ele atualiza o estoque no máximo a cada 60 segundos (útil para performance)
export const revalidate = 60; 

// 2. Função isolada para buscar os dados no backend
async function getEstoque(codempresa: number): Promise<EstoqueAlmoxarifado[]> {
  const URL_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  const response = await fetch(`${URL_BASE}/api/estoque/empresa/${codempresa}/almoxarifado`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar estoque: ${response.statusText}`);
  }

  return response.json();
}

// 3. O componente da página (Server Component)
// Next.js passa os parâmetros da URL automaticamente para a página se configurado na rota, 
// ou você pode fixar/passar o código da empresa aqui.
export default async function EstoquePage() {
  // Exemplo: buscando os dados da empresa código 1. 
  // Se sua rota for /estoque/[empresa], você usaria params.empresa aqui.
  const codempresa = 1; 
  
  try {
    const estoque = await getEstoque(codempresa);

    if (estoque.length === 0) {
      return (
        <div style={{ padding: '20px' }}>
          <p>Nenhum estoque encontrado para a empresa {codempresa}.</p>
        </div>
      );
    }

    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Estoque Almoxarifado</h1>
        <p>Empresa consultada: <strong>{codempresa}</strong></p>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f5', textAlign: 'left', borderBottom: '2px solid #e4e4e7' }}>
              <th style={{ padding: '12px' }}>Almoxarifado (Cód.)</th>
              <th style={{ padding: '12px' }}>Produto</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => (
              <tr key={`${item.codalmoxarifado}-${item.produto}`} style={{ borderBottom: '1px solid #e4e4e7' }}>
                <td style={{ padding: '12px' }}>{item.nomeAlmoxarifado} ({item.codalmoxarifado})</td>
                <td style={{ padding: '12px' }}>{item.produto}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{item.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Não foi possível carregar o estoque</h2>
        <p>Verifique se a API do backend está rodando corretamente.</p>
      </div>
    );
  }
}