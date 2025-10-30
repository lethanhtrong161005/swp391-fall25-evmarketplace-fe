import { useEffect, useMemo, useState } from "react";
import { App } from "antd";
import { getOrderDetail } from "@services/order.service";
import cookieUtils from "@utils/cookieUtils";

export default function useOrderDetail(open, orderId, onOpenPaymentHistory) {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!open || !orderId) return;
        setLoading(true);
        getOrderDetail(orderId)
            .then((res) => setData(res?.data || null))
            .catch((e) => message.error(e?.response?.data?.message || e?.message || "Không tải được chi tiết đơn"))
            .finally(() => setLoading(false));
    }, [open, orderId]);

    const canDownloadContract = useMemo(() => {
        const st = data?.order?.status;
        return st === "CONTRACT_SIGNED" || st === "COMPLETED";
    }, [data?.order?.status]);

    const [contract, setContract] = useState({ open: false, url: "" });
    const viewContract = async () => {
        const url = data?.order?.contractUrl;
        if (!url) return message.info("Chưa có hợp đồng");
        try {
            const token = cookieUtils.getToken();
            const resp = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
                credentials: "include",
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const blob = await resp.blob();
            const blobUrl = URL.createObjectURL(blob);
            setContract({ open: true, url: blobUrl });
        } catch (e) {
            message.error("Không thể tải hợp đồng");
        }
    };
    const closeContract = () => {
        if (contract?.url) URL.revokeObjectURL(contract.url);
        setContract({ open: false, url: "" });
    };

    const copyOrderNo = async () => {
        try {
            await navigator.clipboard.writeText(String(data?.order?.orderNo || ""));
            message.success("Đã sao chép mã đơn (Order No)");
        } catch (e) {
            message.error("Không thể sao chép");
        }
    };


    return {
        loading, data, actions:
        {
            canDownloadContract,
            viewContract,
            closeContract,
            contract,
            copyOrderNo,
            openPaymentHistory: () => onOpenPaymentHistory?.(data?.order)
        }
    };
}


