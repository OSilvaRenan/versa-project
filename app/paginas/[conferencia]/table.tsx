
"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  flexRender,
  Column,
} from "@tanstack/react-table";
import { ArrowUpDown, Check, ShoppingCart, ListChecks } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ConferenciaResponseDTO } from "@/DTO/ConferenciaDTO";
import { Page } from "@/DTO/PageDTO";
import Paginacao from "./paginacao";
import { formatarData } from "@/app/functions/functions";
import { Indseparacao } from "@/DTO/ConferenciaListaDto";

const SortableHeader = ({
  column,
  title,
}: {
  column: Column<any, any>;
  title: string;
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="p-0 h-auto hover:bg-transparent font-semibold text-sm text-gray-700"
  >
    {title}
    <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-500" />
  </Button>
);

interface TableConferenciaProps {
  data: ConferenciaResponseDTO[];
  page: Page;
  rota: string;
}

export default function TableConferencia({
  data,
  page,
  rota,
}: TableConferenciaProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "Datconferencia", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { rotaBase, query } = useMemo(() => {
    const [base, search] = rota.split("?");
    return { rotaBase: base, query: search ? `?${search}` : "" };
  }, [rota]);

  const columns = useMemo<ColumnDef<ConferenciaResponseDTO>[]>(
    () => [
      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <Checkbox
      //       checked={
      //         table.getIsAllPageRowsSelected() ||
      //         (table.getIsSomePageRowsSelected() && "indeterminate")
      //       }
      //       onCheckedChange={(value) =>
      //         table.toggleAllPageRowsSelected(!!value)
      //       }
      //       aria-label="Select all"
      //       className="h-4 w-4"
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       checked={row.getIsSelected()}
      //       onCheckedChange={(value) => row.toggleSelected(!!value)}
      //       aria-label="Select row"
      //       className="h-4 w-4"
      //     />
      //   ),
      //   enableSorting: false,
      //   enableHiding: false,
      // },
      {
        accessorKey: "Codconferencia",
        header: ({ column }) => (
          <SortableHeader column={column} title="Código" />
        ),
        cell: ({ row }) => (
          <div className="font-bold text-gray-900">
            {row.getValue("Codconferencia")}
          </div>
        ),
      },
      {
        accessorKey: "Datconferencia",
        header: ({ column }) => <SortableHeader column={column} title="Data" />,
        cell: ({ row }) => (
          <div className="text-gray-700">
            {formatarData(row.getValue("Datconferencia"))}
          </div>
        ),
        sortingFn: "datetime",
      },
      {
        accessorKey: "Situacaoconferencia",
        header: ({ column }) => (
          <SortableHeader column={column} title="Situação" />
        ),
        cell: ({ row }) => (
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
            {row.getValue("Situacaoconferencia") || "Ativo"}
          </span>
        ),
      },
      {
        accessorKey: "Nomoperacao",
        header: ({ column }) => (
          <SortableHeader column={column} title="Operação" />
        ),
        cell: ({ row }) => (
          <div className="text-gray-700">{row.getValue("Nomoperacao")}</div>
        ),
      },
      {
        accessorKey: "Nomcliente",
        header: ({ column }) => (
          <SortableHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => (
          <div className="text-gray-700">{row.getValue("Nomcliente")}</div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Ações</div>,
        enableSorting: false,
        cell: ({ row }) => {
          const conferencia = row.original;
          const pathBase = `/paginas/${rotaBase}/${conferencia.Codconferencia}`;

          return (
            <div className="flex items-center justify-end gap-1">
              {conferencia.Indconferencialista === 0 && (
                <Button
                  size="icon"
                  className="h-7 w-7"
                  asChild
                  title="Conferir"
                >
                  <Link href={`${pathBase}${query}`}>
                    <Check className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {((conferencia.Indentradasaida === 2 &&
                conferencia.Indseparacao === Indseparacao.Pendente) ||
                conferencia.Indseparacao === Indseparacao.EmSeparacao) && (
                <Button
                  size="icon"
                  className="h-7 w-7"
                  asChild
                  title="Separação"
                >
                  <Link href={`${pathBase}/separacao${query}`}>
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {conferencia.Indentradasaida === 1 && (
                <Button
                  size="icon"
                  className="h-7 w-7"
                  asChild
                  title="Lista de Conferência"
                >
                  <Link href={`${pathBase}/conferencia-lista${query}`}>
                    <ListChecks className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [rotaBase, query],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="w-full space-y-4">
      {/* Visualização Mobile: Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-700">
            Selecionar Todos
          </span>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            className="h-5 w-5"
          />
        </div>

        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const conferencia = row.original;
            const pathBaseMobile = `/paginas/${rotaBase}/${conferencia.Codconferencia}`;

            return (
              <div
                key={row.id}
                className={`bg-card border border-gray-200 rounded-lg p-4 shadow-sm space-y-3 ${
                  row.getIsSelected()
                    ? "ring-2 ring-[#0d6efd]/30 bg-blue-50/20"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      className="h-4 w-4"
                    />
                    <h3 className="font-bold text-gray-900 text-base">
                      Cód: {conferencia.Codconferencia}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {conferencia.Indconferencialista === 0 && (
                      <Button
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        title="Conferir"
                      >
                        <Link href={`${pathBaseMobile}${query}`}>
                          <Check className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                    {((conferencia.Indentradasaida === 2 &&
                      conferencia.Indseparacao === Indseparacao.Pendente) ||
                      conferencia.Indseparacao ===
                        Indseparacao.EmSeparacao) && (
                      <Button
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        title="Separação"
                      >
                        <Link href={`${pathBaseMobile}/separacao${query}`}>
                          <ShoppingCart className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                    {conferencia.Indentradasaida === 1 && (
                      <Button
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        title="Lista de Conferência"
                      >
                        <Link
                          href={`${pathBaseMobile}/conferencia-lista${query}`}
                        >
                          <ListChecks className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Data:</span>
                    <span className="text-gray-800">
                      {formatarData(conferencia.Datconferencia)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Cliente:</span>
                    <span className="text-gray-800 font-semibold">
                      {conferencia.Nomcliente}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Operação:</span>
                    <span className="text-gray-800">
                      {conferencia.Nomoperacao}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-500 font-medium">Situação:</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                      {conferencia.Situacaoconferencia || "Ativo"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card p-4 text-center text-gray-500 rounded-lg border">
            Nenhum registro encontrado.
          </div>
        )}
      </div>

      {/* Visualização Desktop: Tabela */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-gray-200 bg-gray-50/50 text-gray-700 font-semibold"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50/80 transition-colors ${
                    row.getIsSelected() ? "bg-blue-50/30" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-gray-500"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      <div className="flex justify-center pt-2">
        <Paginacao page={page} rota={rota} />
      </div>

      {/* Totalizador */}
      <div className="mt-4 p-2.5 bg-card text-center  rounded-lg border border-gray-200 shadow-sm text-sm font-normal flex flex-col sm:flex-row items-center justify-center px-4 gap-1">
        <span>Total: {page.RecordsCount} conferências</span>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <span className="text-xs text-gray-500">
            ({table.getFilteredSelectedRowModel().rows.length} selecionada(s))
          </span>
        )}
      </div>
    </div>
  );
}
