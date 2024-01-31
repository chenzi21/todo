"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import CDate from "@/libs/CDate";
import { Input, InputProps } from "@/components/ui/input";

export default function ToDoDatePicker(
    props: Omit<InputProps, "value"> & {
        value: CDate;
        setInput: ({ date }: { date: CDate }) => void;
    }
) {
    const date = props.value;
    const time = new CDate(date).toTimeInput();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={"w-full justify-start text-left font-normal"}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        `${format(date.toString(), "PPP")} ${time}`
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Input
                    type="time"
                    min={`${new CDate(date).toTimeInput()}:00`}
                    value={time}
                    onChange={(e) => {
                        const newDate = new CDate(date).setTimeInput(
                            e.target.value
                        );
                        props.setInput({ date: newDate });
                    }}
                    className="border-none shadow-none"
                />
                <Calendar
                    mode="single"
                    fromDate={new Date()}
                    selected={date ?? new CDate()}
                    initialFocus
                    {...props}
                    onSelect={(day) =>
                        day &&
                        props.setInput({
                            date: new CDate(
                                `${format(day, "yyyy-MM-dd")} ${time}`
                            ),
                        })
                    }
                />
            </PopoverContent>
        </Popover>
    );
}

