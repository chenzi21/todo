import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { BasicInputProps } from "@/libs/inputs.t";

export default function UserNameInput({
    form,
    label = "username",
    description = "Please enter Your Username",
}: BasicInputProps) {
    if (!("username" in form.getValues())) {
        throw new Error(
            "username must be present in form in order to use UserName Input Component"
        );
    }

    return (
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...form.register("username", {
                                required: true,
                                minLength: 5,
                            })}
                            {...field}
                            name="username"
                            type="text"
                        />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

