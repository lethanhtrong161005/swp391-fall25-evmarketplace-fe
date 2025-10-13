import { useState, useCallback } from "react";
import { message } from "antd";
import { createPromotionPaymentUrl } from "@services/payment.service.js";

const useListingPayment =  () => {
    const [payingId, setPayingId] = useState(null);

    const payForListing = useCallback(async (rowOrId) => {
        const id = typeof rowOrId === "object" ? rowOrId.id : rowOrId;
        setPayingId(id);
        try {
            const { ok, url, payload } = await createPromotionPaymentUrl(id);
            if (ok) {
                window.location.assign(url); // hoặc window.open(url, "_self")
            } else {
                message.error(payload?.message || "Không lấy được link thanh toán.");
            }
        } catch (err) {
            message.error(
                err?.response?.data?.message || err?.message || "Lỗi khi tạo link thanh toán."
            );
        } finally {
            setPayingId(null);
        }
    }, []);

    return { payingId, payForListing };
}

export default useListingPayment;