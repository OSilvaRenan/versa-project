export async function fetchWrapper<T = unknown>(
  input: string,
  init?: RequestInit
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const url = `${baseUrl}/${input.replace(/^\//, "")}`;

  try {
    const response = await fetch(url, {
      ...init,
      next: { revalidate: 0 }, 
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(` Erro HTTP ${response.status}:`, errorText);
      throw new Error(`Erro na API: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    console.error("🚨 Falha crítica no Fetch:", error.message);
    throw error;
  }
}