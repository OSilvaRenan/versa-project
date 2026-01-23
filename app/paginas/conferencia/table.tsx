"use client";
import React, { useState } from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Check, ShoppingCart, ListChecks } from "lucide-react";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Filters from "./filters";
import { ConferenciaResponseDTO } from "@/DTO/ConferenciaDTO";
import { Page } from "@/DTO/PageDTO";
import Paginacao from "./paginacao";
import { formatarData } from "@/app/functions/functions";

interface TableConferenciaProps {
  data: ConferenciaResponseDTO[];
  page: Page;
  rota: string;
}

export const columns: ColumnDef<ConferenciaResponseDTO>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Codconferencia",
    header: "Código",
    cell: ({ row }) => (
      <div className="w-3.75 pl-4">{row.getValue("Codconferencia")}</div>
    ),
  },
  {
    accessorKey: "Datconferencia",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Data <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-25">{formatarData(row.getValue("Datconferencia"))}</div>
    ),
  },
  {
    accessorKey: "Situacaoconferencia",
    header: "Situação",
    cell: ({ row }) => (
      <div className="w-75">{row.getValue("Situacaoconferencia")}</div>
    ),
  },
  {
    accessorKey: "Nomoperacao",
    header: "Operação",
    cell: ({ row }) => (
      <div className="w-75">{row.getValue("Nomoperacao")}</div>
    ),
  },
  {
    accessorKey: "Nomcliente",
    header: "Cliente",
    cell: ({ row }) => <div className="w-75">{row.getValue("Nomcliente")}</div>,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const conferencia = row.original;

      return (
        <>
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  ...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-15">
                <DropdownMenuItem asChild>
                  <Link href="#" className="flex justify-center p-2">
                    <Pencil className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`conferencia/${conferencia.Codconferencia}`}
                    className="flex justify-center p-2"
                  >
                    <Check className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`conferencia/${conferencia.Codconferencia}/separacao`}
                    className="flex justify-center p-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#">
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`conferencia/${conferencia.Codconferencia}`}>
                <Check className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`conferencia/${conferencia.Codconferencia}/separacao`}
              >
                <ShoppingCart className="h-4 w-4" />
              </Link>
            </Button>
            {conferencia.Indentradasaida === 1 && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                title="Lista de Conferência"
              >
                <Link
                  href={`conferencia/${conferencia.Codconferencia}/conferencia-lista`}
                >
                  <ListChecks className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </>
      );
    },
  },
];

export default function TableConferencia({
  data,
  page,
  rota,
}: TableConferenciaProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <Paginacao page={page} rota={rota} />

        <div className="text-sm text-muted-foreground whitespace-nowrap sm:text-right">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {page.RecordsCount} registro(s).
        </div>
      </div>
    </div>
  );
}
