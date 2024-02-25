import { ReactNode } from "react";
import { ExternalToast, toast } from "sonner";

export const modularToast = (message: ReactNode, options?: ExternalToast | undefined): void => {
    toast(message, {
        ...options,
        duration: 5000,
        dismissible: true,
        closeButton: true,
    });
}