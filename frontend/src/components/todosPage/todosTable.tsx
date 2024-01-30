"use client";

import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { finishTodos, deleteTodo } from "@/libs/todoDBActions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";

interface DataTableProps<TData> {
	data: TData[];
}

const deleteToDo = (id: number) => {
	try {
		deleteTodo(id)
	} catch (e: any) {
		console.log(e);
		toast("There Was an Error Deleting To Do", {
			description: "Please Try Again Later",
		});
		return;
	}
	toast("To Do deleted Successfully");
};

const useColumns = (router: AppRouterInstance): ColumnDef<any, any>[] => ([
	{
		id: "select",
		cell: ({ row }) => (
			<Checkbox
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
	},
	{
		accessorKey: "date",
		header: "Date",
	},
	{
		accessorKey: "todo",
		header: "To Do",
	},
	{
		accessorKey: "urgency",
		header: "Urgency",
	},
	{
		accessorKey: "is_done",
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
					<DropdownMenuItem className="cursor-pointer" onClick={() => {
							try {
								deleteToDo(row.original.id)
								router.refresh();
							} catch(e: any) {
								console.log(e)
							}
						}
					}>
						Delete To Do
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
]);

export default function TodosTable<TData extends { id: number }>({ data }: DataTableProps<TData>) {
	const router = useRouter();
	const [rowSelection, setRowSelection] = useState({});

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
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center box-border justify-between space-x-2 py-4 min-h-20">
				<div className="text-sm text-muted-foreground p-1">
					{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				{Object.keys(rowSelection).length > 0 && (
					<div>
						<Button
							disabled={Object.keys(rowSelection).length == 0}
							onClick={() => {
								const ids = Object.keys(rowSelection).map((val) => data[Number(val)].id);
								try {
									finishTodos(ids)
								} catch (e: any) {
									console.log(e);
									toast("Error Updating To Dos", {
										description: "There was a Problem Updating To Dos, Please Try Again Later",
										important: true,
									});
									return;
								}
								toast("Succesfully Updated To Dos", {
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
				<div className="space-x-2">
					<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
