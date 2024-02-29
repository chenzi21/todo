import { FilterIcon, FilterXIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Todo } from "@/libs/types/todo";
import { Header } from "@tanstack/react-table";

type Props = {
    data: Todo[];
    header: Header<any, unknown>;
};

const ICON_SIZE = 20;

export default function TableFilter({ data, header }: Props) {
    if (!!header.column.getFilterValue()) {
        return (
            <FilterXIcon
                className="cursor-pointer"
                size={ICON_SIZE}
                onClick={() => header.column.setFilterValue(undefined)}
            />
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <FilterIcon className="cursor-pointer" size={ICON_SIZE} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-[50vw]" align="end">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                {[
                    ...new Set(
                        data.map((todo) =>
                            header.column.id in todo ? (
                                <DropdownMenuItem
                                    key={`${todo.id}_${header.id}`}
                                    onClick={() =>
                                        header.column.setFilterValue(
                                            todo[
                                                header.column
                                                    .id as keyof typeof todo
                                            ].toString()
                                        )
                                    }
                                >
                                    <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        {todo[
                                            header.column
                                                .id as keyof typeof todo
                                        ].toString()}
                                    </p>
                                </DropdownMenuItem>
                            ) : null
                        )
                    ),
                ].filter((val) => !!val)}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

