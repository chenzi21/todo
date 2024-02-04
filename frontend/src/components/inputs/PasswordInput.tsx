import { RegisterOptions } from "react-hook-form";
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

type ExtendedPasswordInputProps = BasicInputProps & {
    inputName?: string;
    registerOptions?: RegisterOptions;
};

export default function PasswordInput({
    form,
    registerOptions,
    inputName = "password",
    label = "password",
    description = "Please enter Your password",
}: ExtendedPasswordInputProps) {
    if (!(inputName in form.getValues())) {
        throw new Error(
            `${inputName} must be present in form in order to use Password Input Component`
        );
    }

    return (
        <FormField
            control={form.control}
            name={inputName}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            {...form.register(inputName, {
                                required: true,
                                minLength: 8,
                                pattern: {
                                    value: new RegExp(
                                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$"
                                    ),
                                    message:
                                        "password needs to be at least 8 characters and contain at least one lower case letter, upper case letter and special character",
                                },
                            })}
                            // {...form.register(inputName, {
                            //     ...registerOptions,
                            // })}
                            name={inputName}
                            type="password"
                        />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
