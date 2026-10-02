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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    className="p-0 h-auto hover:bg-transparent font-bold text-xs"
  >
    {title}
    <ArrowUpDown className="ml-1 h-3 w-3" />
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
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="h-4 w-4"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="h-4 w-4"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "Codconferencia",
        header: ({ column }) => (
          <SortableHeader column={column} title="Código" />
        ),
        cell: ({ row }) => (
          <div className="text-xs">{row.getValue("Codconferencia")}</div>
        ),
      },
      {
        accessorKey: "Datconferencia",
        header: ({ column }) => <SortableHeader column={column} title="Data" />,
        cell: ({ row }) => (
          <div className="text-xs">
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
          <div className="text-xs truncate max-w-37.5">
            {row.getValue("Situacaoconferencia")}
          </div>
        ),
      },
      {
        accessorKey: "Nomoperacao",
        header: ({ column }) => (
          <SortableHeader column={column} title="Operação" />
        ),
        cell: ({ row }) => (
          <div className="text-xs truncate max-w-37.5">
            {row.getValue("Nomoperacao")}
          </div>
        ),
      },
      {
        accessorKey: "Nomcliente",
        header: ({ column }) => (
          <SortableHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => (
          <div className="text-xs truncate max-w-50">
            {row.getValue("Nomcliente")}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Ações",
        enableSorting: false,
        cell: ({ row }) => {
          const conferencia = row.original;
          const pathBase = `/paginas/${rotaBase}/${conferencia.Codconferencia}`;

          return (
            <div className="flex items-center space-x-1">
              {conferencia.Indconferencialista == 0 && (
                <Button variant="ghost" className="h-6 w-6 p-0" asChild>
                  <Link href={`${pathBase}${query}`}>
                    <Check className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {((conferencia.Indentradasaida == 2 &&
                conferencia.Indseparacao == Indseparacao.Pendente) ||
                conferencia.Indseparacao == Indseparacao.EmSeparacao) && (
                <Button variant="ghost" className="h-6 w-6 p-0" asChild>
                  <Link href={`${pathBase}/separacao${query}`}>
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {conferencia.Indentradasaida == 1 && (
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-0"
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
    <div className="w-full max-w-[100vw] px-3 md:px-0 space-y-4">
      <div className="block md:hidden space-y-4">
        <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md border">
          <span className="text-xs font-semibold text-muted-foreground pl-1">
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
            className="h-5 w-5 mr-1"
          />
        </div>
        {table.getRowModel().rows?.map((row) => {
          const pathBaseMobile = `/paginas/${rotaBase}/${row.original.Codconferencia}`;
          return (
            <div
              key={row.id}
              className={`p-4 rounded-lg border bg-card shadow-sm space-y-3 ${row.getIsSelected() ? "border-primary/50 bg-primary/5" : "border-border"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-sm">
                    #{row.original.Codconferencia}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatarData(row.original.Datconferencia)}
                  </span>
                </div>
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  className="h-6 w-6"
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold uppercase leading-none">
                  {row.original.Nomcliente}
                </div>
                <div className="text-xs text-muted-foreground flex gap-2 pt-1 items-center">
                  <span className="truncate max-w-45">
                    .{row.original.Nomoperacao}
                  </span>
                  <span className="text-[10px]">•</span>
                  <span>{row.original.Situacaoconferencia}</span>
                </div>
              </div>
              <div className="pt-3 border-t flex items-center justify-end gap-2">
                {row.original.Indconferencialista == 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 bg-muted/50"
                    asChild
                  >
                    <Link href={`${pathBaseMobile}${query}`}>
                      <Check className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {((row.original.Indentradasaida == 2 &&
                  row.original.Indseparacao == Indseparacao.Pendente) ||
                  row.original.Indseparacao == Indseparacao.EmSeparacao) && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 bg-muted/50"
                    asChild
                  >
                    <Link href={`${pathBaseMobile}/separacao${query}`}>
                      <ShoppingCart className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {row.original.Indentradasaida == 1 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 bg-muted/50"
                    asChild
                  >
                    <Link href={`${pathBaseMobile}/conferencia-lista${query}`}>
                      <ListChecks className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="h-8 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-8 py-0 px-2 text-xs font-bold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-8 hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-0 px-2 h-8">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center text-xs"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 px-1">
        <Paginacao page={page} rota={rota} />
        <div className="text-[11px] text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {page.RecordsCount} registro(s).
        </div>
      </div>
    </div>
  );
}