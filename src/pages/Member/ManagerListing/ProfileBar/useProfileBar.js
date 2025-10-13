
import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import { getUserProfile } from "@services/accountService";

export default function useUserProfileBar({ toast = false } = {}) {
    const [loading, setLoading] = useState(true);
    const [error, setErr] = useState(null);
    const [data, setData] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
      
            const payload = await getUserProfile();

            // An toàn: BE bọc BaseResponse
            const ok = payload?.success !== false && (payload?.status ?? 200) < 400;
            const d = payload?.data || {};

            if (!ok) {
                throw new Error(payload?.message || "Get profile failed");
            }

            const fullName = d?.profile?.fullName || "Người dùng";
            const avatarUrl = d?.profile?.avatarUrl || null;
            const role = String(d?.role || "MEMBER").toUpperCase();

            // Hiện BE chưa trả summary/noti → đặt default 0
            setData({
                profile: { id: d?.id, fullName, avatarUrl, role },
                stats: { published: 0, pending: 0, draft: 0, rejected: 0, needPayment: 0 },
                unread: 0,
            });
        } catch (e) {
            setErr(e);
            if (toast) message.error(e?.message || "Không tải được thông tin tài khoản");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return { loading, error, data, refresh: load };
}
