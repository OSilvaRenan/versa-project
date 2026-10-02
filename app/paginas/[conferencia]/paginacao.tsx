"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationStart,
  PaginationLast,
} from "@/components/ui/pagination";
import { Page } from "@/DTO/PageDTO";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  page: Page;
  rota: string;
}

const Paginacao = ({ page, rota }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const nroPages = Math.ceil((page.RecordsCount || 0) / (page.PageSize || 10));
  const pgAtual = parseInt(searchParams.get("pg") || "1");

  function EnviaDadosPaginacao(index: number) {
    let novoIndex = index;

    if (novoIndex <= 0) novoIndex = 1;
    if (novoIndex > nroPages) novoIndex = nroPages;
    if (novoIndex === pgAtual) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("pg", novoIndex.toString());

    // Usamos o pathname atual em vez da prop 'rota' para evitar a duplicação de "?"
    // O parâmetro 'entrada=1' já está preservado dentro do objeto 'params'
    router.push(`${pathname}?${params.toString()}`);
  }

  if (!page.RecordsCount || nroPages <= 0) return null;

  return (
    <div className="container flex items-center justify-between max-h-full px-auto">
      <Pagination>
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationStart onClick={() => EnviaDadosPaginacao(1)} />
          </PaginationItem>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={() => EnviaDadosPaginacao(pgAtual - 1)}
            />
          </PaginationItem>

          <span className="text-sm font-medium mx-2">
            {page.PageIndex} / {nroPages}
          </span>

          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={() => EnviaDadosPaginacao(pgAtual + 1)} />
          </PaginationItem>
          <PaginationItem className="cursor-pointer">
            <PaginationLast onClick={() => EnviaDadosPaginacao(nroPages)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paginacao;