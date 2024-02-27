"use client";

import {
    ColumnDef,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { finishTodos, deleteTodo } from "@/libs/dbActions/todo";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { Todo } from "@/libs/types/todo";
import { modularToast } from "@/libs/toastUtils";
import useIsMobile from "@/libs/useIsMobile";
import { toast } from "sonner";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import TodoDrawer from "./TodoDrawer";

interface DataTableProps<TData> {
    data: TData[];
}

const deleteToDo = (id: number) => {
    try {
        deleteTodo(id);
    } catch (e: any) {
        console.log(e);
        toast.error("There Was an Error Deleting To Do", {
            description: "Please Try Again Later",
            closeButton: true,
        });
        return;
    }
    modularToast("To Do deleted Successfully");
};

const useColumns = (router: AppRouterInstance): ColumnDef<any, any>[] => {
    const isMobile = useIsMobile();

    const cols: ColumnDef<any, any>[] = [
        {
            accessorKey: "todo",
            header: "To Do",
            maxSize: 5,
            cell: ({ cell }) => (
                <p className="block max-w-24 max-h-6 overflow-x-hidden text-ellipsis">
                    {cell.renderValue()}
                </p>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                try {
                                    deleteToDo(row.original.id);
                                    router.refresh();
                                } catch (e: any) {
                                    console.log(e);
                                }
                            }}
                        >
                            Delete To Do
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    if (isMobile !== undefined && !isMobile) {
        cols.splice(
            0,
            0,
            {
                id: "select",
                cell: ({ row }) => (
                    <Checkbox
                        onClick={(e) => e.stopPropagation()}
                        disabled={row.original.is_done}
                        checked={!row.original.is_done && row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="block"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "id",
                header: "ID",
            }
        );
        cols.splice(
            4,
            0,
            {
                accessorKey: "urgency",
                header: "Urgency",
            },
            {
                accessorKey: "is_done",
                header: "is Done",
            }
        );
    }

    return cols;
};

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
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
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
                                                        className={
                                                            isMobile !==
                                                            undefined
                                                                ? ""
                                                                : "opacity-0"
                                                        }
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

