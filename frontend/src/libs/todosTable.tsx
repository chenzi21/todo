import { toast } from "sonner";
import { deleteTodo, finishTodos } from "./dbActions/todo";
import { UrgencyKeys, urgencyList } from "./urgencies";
import { modularToast } from "./toastUtils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const urgencyToNumericValues: Partial<Record<UrgencyKeys, number>> = {};

for (let i = 0; i < urgencyList.length; i++) {
    const { value } = urgencyList[i];
    urgencyToNumericValues[value] = i;
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

const useColumns = (router: AppRouterInstance): ColumnDef<any, any>[] => [
    {
        id: "select",
        cell: ({ row }) => (
            <Checkbox
                onClick={(e) => e.stopPropagation()}
                disabled={row.original.is_done === "Yes"}
                checked={row.original.is_done === "No" && row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="block"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "todo",
        id: "todo",
        header: "To Do",
        sortingFn: "textCaseSensitive",
    },
    {
        accessorKey: "date",
        id: "date",
        header: "Date",
        enableSorting: true,
        sortingFn: "datetime",
        invertSorting: true,
    },
    {
        accessorKey: "urgency",
        id: "urgency",
        sortDescFirst: true,
        sortingFn: (rowa, rowb, colId) =>
            (urgencyToNumericValues[rowa.getValue(colId) as UrgencyKeys] ?? 0) -
            (urgencyToNumericValues[rowb.getValue(colId) as UrgencyKeys] ?? 0),
        header: "Urgency",
    },
    {
        accessorKey: "is_done",
        sortDescFirst: false,
        invertSorting: true,
        header: "is Done",
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
                    {row.original.is_done === "No" && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/editTodo/${row.original.id}`);
                            }}
                        >
                            Edit To Do
                        </DropdownMenuItem>
                    )}
                    {row.original.is_done === "No" && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                try {
                                    finishTodos([row.original.id]);
                                    router.refresh();
                                } catch (e: any) {
                                    console.log(e);
                                }
                            }}
                        >
                            Mark As Done
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default useColumns;

