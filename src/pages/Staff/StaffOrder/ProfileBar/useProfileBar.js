// src/pages/StaffOrder/ProfileBar/useProfileBar.js
import { useMemo } from "react";
import cookieUtils from "@utils/cookieUtils";

export function useStaffId() {
    return useMemo(() => {
        const p = cookieUtils.decodeJwt();
        return (
            p?.uid ??
            p?.accountId ??
            p?.userId ??
            p?.id ??
            (typeof p?.sub === "number" ? p.sub : undefined) ??
            window.localStorage.getItem("staffId")
        );
    }, []);
}

export function useProfileBar(rows, loading) {
    return useMemo(() => {
        if (loading || !rows?.length) {
            return { totalOrders: 0, totalAmount: 0, paidCount: 0 };
        }
        const totalOrders = rows.length;
        const totalAmount = rows.reduce((s, r) => s + (r?.amount || 0), 0);

        const paidLike = new Set(["PAID", "CONTRACT_SIGNED", "COMPLETED"]);
        const paidCount = rows.filter((r) => paidLike.has(r?.status)).length;

        return { totalOrders, totalAmount, paidCount };
    }, [rows, loading]);
}
