// HistoryPaymentModal/usePaymentHistory.js
import { useEffect, useState, useCallback } from "react";
import { App } from "antd";
import { listPaymentByOrderId } from "@services/payment.service.js";

const PAGE_SIZE = 2;

export default function usePaymentHistory(open, orderId, pageSize = PAGE_SIZE) {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [lastId, setLastId] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    const reset = useCallback(() => {
        setItems([]);
        setLastId(null);
        setHasMore(false);
    }, []);

    const fetchPage = useCallback(async (cursor) => {
        setLoading(true);
        try {
            const res = await listPaymentByOrderId({ orderId, lastId: cursor ?? null, limit: pageSize });
            const data = res?.data;
            const newItems = Array.isArray(data?.items) ? data.items : [];
            setItems(prev => (cursor ? [...prev, ...newItems] : newItems));
            setHasMore(!!data?.hasMore);
            setLastId(newItems.length ? newItems[newItems.length - 1].id : cursor ?? null);
        } catch (e) {
            message.error(e?.response?.data?.message || e?.message || "Không tải được lịch sử thanh toán");
        } finally {
            setLoading(false);
        }
    }, [orderId, pageSize, message]);

    useEffect(() => {
        if (!open || !orderId) return;
        reset();
        fetchPage(null);
    }, [open, orderId, reset, fetchPage]);

    const loadMore = () => {
        if (!hasMore || loading) return;
        fetchPage(lastId);
    };

    return { loading, items, hasMore, loadMore, refresh: () => { reset(); fetchPage(null); } };
}
