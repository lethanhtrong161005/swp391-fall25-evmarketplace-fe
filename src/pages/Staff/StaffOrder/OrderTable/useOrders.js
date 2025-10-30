import { useEffect, useState, useRef } from "react";
import { message } from "antd";
import { getAllOrderByUserId } from "@services/order.service.js";
import { useGetId } from "@utils/getInfoFromToken";



export default function useOrders(queryParams) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const lastReq = useRef(0);
    const staffId = useGetId();

    const load = async () => {
        const reqId = Date.now();
        lastReq.current = reqId;
        setLoading(true);
        queryParams = {
            userId: staffId,
            ...queryParams
        }
        try {
            const res = await getAllOrderByUserId({ params: queryParams });
            if (lastReq.current !== reqId) return;

            setRows(res.items || []);
            setTotal(res.total ?? 0);
        } catch (e) {
            const msg = e?.message || e?.response?.data?.message || "Lỗi tải đơn hàng";
            message.error(msg);
        } finally {
            if (lastReq.current === reqId) setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [JSON.stringify(queryParams)]);

    return { loading, rows, total, load };
}
