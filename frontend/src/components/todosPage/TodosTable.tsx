"use client";

import {
    Cell,
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
import { useEffect, useMemo, useState } from "react";
import { Todo } from "@/libs/types/todo";
import { modularToast } from "@/libs/toastUtils";
import useIsMobile from "@/libs/useIsMobile";
import { toast } from "sonner";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import TodoDrawer from "./TodoDrawer";
import useColumns from "@/libs/todosTable";
import { deleteTodos, finishTodos } from "@/libs/dbActions/todo";
import TableFilter from "./TableFilter";
import { SortAscIcon, SortDescIcon } from "lucide-react";

interface DataTableProps<TData> {
    data: TData[];
}

const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const HOURS = 24;
const DAY = MILLISECONDS * SECONDS * MINUTES * HOURS;

const now = new Date().getTime();

const getCellClassName = (
    cell: Cell<Omit<Todo, "date"> & { date: string }, unknown>
) => {
    if (cell.column.id === "todo") {
        return `max-w-[36vw] sm:max-w-[28vw] md:max-w-[22vw] lg:max-w-[16vw] max-h-[6vh] whitespace-nowrap overflow-hidden text-ellipsis${
            cell.row.original.is_done === "Yes" ? " line-through" : ""
        }`;
    }

    if (cell.column.id === "date" && cell.row.original.is_done === "No") {
        const timeDifference = new Date(cell.row.original.date).getTime() - now;
        if (timeDifference <= DAY) {
            if (timeDifference > 0) {
                return "text-yellow-500";
            }
            return "text-red-500";
        }
    }

    if (cell.column.id === "urgency") {
        switch (cell.row.original.urgency) {
            case "very-low":
                return "text-green-500";
            case "low":
                return "text-green-400";
            case "medium":
                return "text-yellow-400";
            case "high":
                return "text-red-400";
            case "very-high":
                return "text-red-500";
        }
    }

    return "";
};

export default function TodosTable({ data }: DataTableProps<Todo>) {
    const router = useRouter();
    const [rowSelection, setRowSelection] = useState({});
    const [pIndex, setPIndex] = useState<number>(0);
    const isMobile = useIsMobile();
    const pageSize = isMobile === false ? 10 : 8;
    const columns = useColumns(router);

    const parsedData = useMemo(
        () =>
            data.map((todo: Todo) => ({
                ...todo,
                date: new Date(todo.date).toLocaleString(),
                is_done: todo.is_done ? "Yes" : "No",
            })),
        [data]
    );

    const table = useReactTable({
        data: parsedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableSorting: true,
        sortDescFirst: true,
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

    const filteredData = table
        .getFilteredRowModel()
        .rows.map((row) => row.original);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

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
                                                <div className="flex justify-start align-center pr-4">
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? "flex gap-2 cursor-pointer select-none w-max"
                                                                : ""
                                                        }
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <div
                                                                className={
                                                                    !!header.column.getIsSorted()
                                                                        ? "text-black"
                                                                        : ""
                                                                }
                                                                onClick={header.column.getToggleSortingHandler()}
                                                            >
                                                                {
                                                                    {
                                                                        desc: (
                                                                            <SortDescIcon />
                                                                        ),
                                                                        asc: (
                                                                            <SortAscIcon />
                                                                        ),
                                                                    }[
                                                                        header.column.getIsSorted() ||
                                                                            "desc"
                                                                    ]
                                                                }
                                                            </div>
                                                        )}
                                                        {header.column.getCanFilter() && (
                                                            <TableFilter
                                                                data={
                                                                    filteredData
                                                                }
                                                                header={header}
                                                            />
                                                        )}
                                                    </div>
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
                                                        suppressHydrationWarning
                                                        key={cell.id}
                                                        className={`${
                                                            isMobile !==
                                                            undefined
                                                                ? ""
                                                                : "opacity-0"
                                                        } ${getCellClassName(
                                                            cell
                                                        )}`}
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
                {Object.keys(rowSelection).length > 0 && (
                    <div className="flex gap-4">
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
                        <Button
                            disabled={Object.keys(rowSelection).length == 0}
                            onClick={() => {
                                const ids = Object.keys(rowSelection).map(
                                    (val) => data[Number(val)].id
                                );
                                try {
                                    deleteTodos(ids);
                                } catch (e: any) {
                                    console.log(e);
                                    toast.error("Error Deleting To Dos", {
                                        description:
                                            "There was a Problem Deleting To Dos, Please Try Again Later",
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
                            Delete To dos
                        </Button>
                    </div>
                )}
                <div className="space-x-2 ms-auto flex">
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

