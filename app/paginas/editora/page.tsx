"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PaginedList, Page as PageType } from "@/DTO/PageDTO";
import { EditoraDTO } from "./EditoraDTO";
import FiltersEditora from "./filters";
import { fetchWrapper } from "@/app/api/fetch";
import TableEditora from "./table";

export default function Page() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<EditoraDTO[]>([]);
  const [pageData, setPageData] = useState<PageType>({
    RecordsCount: 0,
    PageIndex: 1,
    PageSize: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const nomeditora = searchParams.get("nomeditora") || "";
  const nomeditoragrupo = searchParams.get("nomeditoragrupo") || "";
  const pg = searchParams.get("pg") || "1";
  const pageSizeParam = searchParams.get("pageSize") || "10";
  const pageSize = parseInt(pageSizeParam, 10) || 10;

  const paramsLimpos = new URLSearchParams(searchParams.toString());
  paramsLimpos.delete("pg");
  const queryLimpa = paramsLimpos.toString();
  const rota = `editoras${queryLimpa ? `?${queryLimpa}` : ""}`;

  useEffect(() => {
    let isMounted = true;

    const temBusca =
      searchParams.has("nomeditora") ||
      searchParams.has("codeditoragrupo") ||
      searchParams.has("pg");

    if (!temBusca) {
      setData([]);
      setPageData({
        RecordsCount: 0,
        PageIndex: 1,
        PageSize: pageSize,
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      try {
        const pageIndex = parseInt(pg, 10) || 1;

        const request = {
          Nomeditora: nomeditora,
          Nomeditoragrupo: nomeditoragrupo,
          PageIndex: pageIndex,
          PageSize: pageSize,
        };

        const response = await fetchWrapper<PaginedList<EditoraDTO>>(
          "api/produto/editora/pesquisa",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          },
        );

        if (isMounted) {
          setData(response?.Dados ?? []);
          setPageData(
            response?.Page ?? {
              RecordsCount: 0,
              PageIndex: pageIndex,
              PageSize: pageSize,
            },
          );
        }
      } catch (error) {
        console.error("Erro ao carregar editoras:", error);
        if (isMounted) {
          setData([]);
          setPageData({
            RecordsCount: 0,
            PageIndex: parseInt(pg, 10) || 1,
            PageSize: pageSize,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [searchParams, nomeditora, nomeditoragrupo, pg, pageSize]);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 space-y-4">
      <FiltersEditora />

      {loading ? (
        <div className="bg-card p-6 text-center text-gray-500 rounded-lg border border-gray-200 shadow-sm">
          Carregando editoras...
        </div>
      ) : (
        <TableEditora data={data} page={pageData} rota={rota} />
      )}
    </div>
  );
}
