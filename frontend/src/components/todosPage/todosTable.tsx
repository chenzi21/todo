"use client";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Todo } from "@/libs/types/todo";
import { modularToast } from "@/libs/toastUtils";
import useIsMobile from "@/libs/useIsMobile";
import { toast } from "sonner";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import TodoDrawer from "./TodoDrawer";
import useColumns from "@/libs/todosTable";
import { finishTodos } from "@/libs/dbActions/todo";

interface DataTableProps<TData> {
    data: TData[];
}

export default function TodosTable({ data }: DataTableProps<Todo>) {
    const router = useRouter();
    const [rowSelection, setRowSelection] = useState({});
    const [pIndex, setPIndex] = useState<number>(0);
    const isMobile = useIsMobile();
    const pageSize = isMobile === false ? 10 : 8;
    const columns = useColumns(router);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableSorting: true,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
            pagination: {
                pageIndex: pIndex,
                pageSize,
            },
        },
    });

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={
                                                isMobile !== undefined
                                                    ? ""
                                                    : "opacity-0"
                                            }
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className:
                                                            header.column.getCanSort()
                                                                ? "cursor-pointer select-none"
                                                                : "",
                                                        onClick:
                                                            header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        desc: " 🔼",
                                                        asc: " 🔽",
                                                    }[
                                                        header.column.getIsSorted() as string
                                                    ] ?? null}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Drawer key={row.id}>
                                    <DrawerTrigger asChild>
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                            className={
                                                isMobile === undefined
                                                    ? "motion-safe:animate-pulse rounded-md bg-gray-900/10 dark:bg-gray-50/10"
                                                    : ""
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className={`${
                                                            isMobile !==
                                                            undefined
                                                                ? ""
                                                                : "opacity-0"
                                                        }
                                                                ${
                                                                    cell.column
                                                                        .id ===
                                                                    "todo"
                                                                        ? "max-w-[36vw] sm:max-w-[28vw] md:max-w-[22vw] lg:max-w-[16vw] max-h-[6vh] whitespace-nowrap overflow-hidden text-ellipsis"
                                                                        : ""
                                                                }`}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    </DrawerTrigger>
                                    <TodoDrawer todo={row.original} />
                                </Drawer>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center box-border justify-between space-x-2 py-4 min-h-20">
                {isMobile === false && (
                    <div className="text-sm text-muted-foreground p-1">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                )}
                {!isMobile && Object.keys(rowSelection).length > 0 && (
                    <div>
                        <Button
                            disabled={Object.keys(rowSelection).length == 0}
                            onClick={() => {
                                const ids = Object.keys(rowSelection).map(
                                    (val) => data[Number(val)].id
                                );
                                try {
                                    finishTodos(ids);
                                } catch (e: any) {
                                    console.log(e);
                                    toast.error("Error Updating To Dos", {
                                        description:
                                            "There was a Problem Updating To Dos, Please Try Again Later",
                                    });
                                    return;
                                }
                                modularToast("Succesfully Updated To Dos", {
                                    description: "To Dos were Updated",
                                });
                                setRowSelection({});
                                router.refresh();
                            }}
                        >
                            Mark as Done
                        </Button>
                    </div>
                )}
                <div
                    className={`space-x-2 ms-auto flex ${
                        isMobile ? "justify-between w-[100%]" : ""
                    }`}
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPIndex((prev) => prev - 1)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPIndex((prev) => prev + 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

