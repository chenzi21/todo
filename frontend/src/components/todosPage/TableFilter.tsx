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
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                {[
                    ...new Set(
                        data.map((todo) =>
                            header.column.id in todo
                                ? todo[
                                      header.column.id as keyof typeof todo
                                  ].toString()
                                : null
                        )
                    ),
                ]
                    .filter((val) => !!val)
                    .map((val) => (
                        <DropdownMenuItem
                            onClick={() => header.column.setFilterValue(val)}
                        >
                            {val}
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

