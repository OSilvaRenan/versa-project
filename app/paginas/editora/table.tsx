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
import { ArrowUpDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Page } from "@/DTO/PageDTO";
import { EditoraDTO } from "./EditoraDTO";
import { DialogCadastroEditora } from "./DialogCadastroEditora";
import Paginacao from "../[conferencia]/paginacao";

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

interface TableEditoraProps {
  data: EditoraDTO[];
  page: Page;
  rota: string;
}

export default function TableEditora({ data, page, rota }: TableEditoraProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "Nomeditora", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<EditoraDTO>[]>(
    () => [
      {
        accessorKey: "Codeditora",
        header: ({ column }) => (
          <SortableHeader column={column} title="Código" />
        ),
        cell: ({ row }) => {
          const editora = row.original;
          return (
            <div className="flex items-center  gap-1">
              <DialogCadastroEditora codeditora={editora.Codeditora} />
            </div>
          );
        },
      },
      {
        accessorKey: "Nomeditora",
        header: ({ column }) => (
          <SortableHeader column={column} title="Editora" />
        ),
        cell: ({ row }) => (
          <div className="text-gray-700 font-medium">
            {row.getValue("Nomeditora")?.toString().trim()}
          </div>
        ),
      },
      {
        accessorKey: "Nomeditoragrupo",
        header: ({ column }) => (
          <SortableHeader column={column} title="Editora Grupo" />
        ),
        cell: ({ row }) => (
          <div className="text-gray-700">{row.getValue("Nomeditoragrupo")}</div>
        ),
      },
    ],
    [],
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
            const editora = row.original;

            return (
              <div
                key={row.id}
                className={`bg-card border border-gray-200 rounded-lg p-4 shadow-sm space-y-3 ${
                  row.getIsSelected() ? "ring-2" : ""
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
                      Cód: {editora.Codeditora}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <DialogCadastroEditora codeditora={editora.Codeditora} />
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-700 text-xs font-medium">
                      Editora:
                    </span>
                    <span className="text-gray-700 font-semibold text-base">
                      {editora.Nomeditora?.trim()}
                    </span>
                  </div>
                  {editora.Nomeditoragrupo && (
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs font-medium">
                        Grupo:
                      </span>
                      <span className="text-gray-700">
                        {editora.Nomeditoragrupo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card p-4 text-center text-gray-500 rounded-lg border">
            Nenhuma editora encontrada.
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
                  Nenhuma editora encontrada.
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
      <div className="mt-4 p-2.5 bg-card text-center rounded-lg border border-gray-200 shadow-sm text-sm font-normal flex flex-col sm:flex-row items-center justify-center px-4 gap-1">
        <span>Total: {page?.RecordsCount ?? 0} editoras</span>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <span className="text-xs text-gray-500">
            ({table.getFilteredSelectedRowModel().rows.length} selecionada(s))
          </span>
        )}
      </div>
    </div>
  );
}
