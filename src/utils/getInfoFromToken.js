import { useMemo } from "react";
import cookieUtils from "@utils/cookieUtils";

export const useGetId = () => {
    return useMemo(() => {
        const p = cookieUtils.decodeJwt();
        return (
            p?.uid
        );
    }, []);
}