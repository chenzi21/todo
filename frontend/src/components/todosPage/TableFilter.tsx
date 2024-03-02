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
                className="cursor-pointer text-black"
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
            <DropdownMenuContent
                className="max-w-[50vw] max-h-[29vh] overflow-y-auto"
                align="end"
            >
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
                            key={`${header.id}_${val}`}
                            onClick={() => header.column.setFilterValue(val)}
                        >
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                                {val}
                            </p>
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

