import { useMemo } from "react";
import cookieUtils from "@utils/cookieUtils";


export const useGetId = () => {
    return useMemo(() => {
        const token = cookieUtils.decodeJwt();
        return token?.uid;
    }, []);
};
