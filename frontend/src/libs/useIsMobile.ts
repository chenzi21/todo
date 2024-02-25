import { useEffect, useState } from "react";

export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean | undefined>();

    useEffect(() => {
        if (!isMobile) {
            setIsMobile(!!window && "ontouchstart" in window);
        }
    }, []);

    return isMobile;
}