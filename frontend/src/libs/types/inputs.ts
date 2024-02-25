import { UseFormReturn } from "react-hook-form";

export type BasicInputProps = {
    form: UseFormReturn<any, any, undefined>;
    label?: string;
    description?: string;
};