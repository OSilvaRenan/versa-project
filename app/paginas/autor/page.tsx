"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PaginedList, Page as PageType } from "@/DTO/PageDTO";
import { AutorDTO } from "@/DTO/AutorDTO";
import TableAutor from "./table";
import FiltersAutor from "./filters";
import { fetchWrapper } from "@/app/api/fetch";

export default function Page() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<AutorDTO[]>([]);
  const [pageData, setPageData] = useState<PageType>({
    RecordsCount: 0,
    PageIndex: 1,
    PageSize: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const nomautor = searchParams.get("nomautor") || "";
  const pg = searchParams.get("pg") || "1";
  const pageSizeParam = searchParams.get("pageSize") || "10";
  const pageSize = parseInt(pageSizeParam, 10) || 10;

  const paramsLimpos = new URLSearchParams(searchParams.toString());
  paramsLimpos.delete("pg");
  const queryLimpa = paramsLimpos.toString();
  const rota = `autores${queryLimpa ? `?${queryLimpa}` : ""}`;

  useEffect(() => {
    let isMounted = true;


    const temBusca = searchParams.has("nomautor") || searchParams.has("pg");

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

        // Payload plano correspondente à classe C# versaAPP.Bus.AutorRequest
        const request = {
          Nomautor: nomautor,
          PageIndex: pageIndex,
          PageSize: pageSize,
        };

        const response = await fetchWrapper<PaginedList<AutorDTO>>(
          "api/produto/autor/pesquisa",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          }
        );

        if (isMounted) {
          setData(response?.Dados ?? []);
          setPageData(
            response?.Page ?? {
              RecordsCount: 0,
              PageIndex: pageIndex,
              PageSize: pageSize,
            }
          );
        }
      } catch (error) {
        console.error("Erro ao carregar autores:", error);
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
  }, [searchParams, nomautor, pg, pageSize]);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 space-y-4">
      <FiltersAutor />

      {loading ? (
        <div className="bg-card p-6 text-center text-gray-500 rounded-lg border border-gray-200 shadow-sm">
          Carregando autores...
        </div>
      ) : (
        <TableAutor data={data} page={pageData} rota={rota} />
      )}
    </div>
  );
}