import api from "@utils/apiCaller";
import { post } from "@utils/apiCaller";

const BASE_API = "/api/payment"

export const createPromotionPaymentUrl = async (listingId) => {
    const res = await api.post(`/api/payment/promotion/${listingId}`);
    const payload = res?.data ?? res;
    const url = payload?.data;
    const ok = Boolean(payload?.success) && typeof url === "string" && url.startsWith("http");
    return { ok, url, payload };
}

export const verifyVnpReturn = async (queryParams) => {
    const res = await api.get(`/api/payment/vnpay/return`, { params: queryParams });
    const payload = res?.data ?? res;
    const ok = Boolean(payload?.success);
    return { ok, payload };
};


export const createVNPayPayment = async (orderId, { amountVnd }) => {
    const payload = await post(
        `/api/payment/${orderId}`,
        {
            method: "VNPAY",
            amountVnd,
            referenceNo: "",
            note: ""
        }
    );

    const url = payload?.data;
    const ok = Boolean(payload?.success) && typeof url === "string" && url.startsWith("http");

    return { ok, url, payload };
};


export const listPaymentByOrderId = async ({ orderId, lastId, limit = 2 }) => {
    const params = { orderId, limit };
    if (lastId) params.lastId = lastId;

    const { data: res } = await api.get(BASE_API, { params });

    return res;
}