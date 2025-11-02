import api from "@utils/apiCaller";
const BASE = "/api/contract";
import dayjs from "dayjs";


const toLocalLdt = (d) => (d ? dayjs(d).format("YYYY-MM-DDTHH:mm:ss") : null);



export async function createOrderContract({
    orderId,
    staffId,
    file,
    note,
    effectiveFrom,
    effectiveTo,
}) {
    const formData = new FormData();
    formData.append(
        "payload",
        JSON.stringify({ orderId, staffId, note, effectiveFrom, effectiveTo })
    );
    formData.append("file", file);

    try {
        const { data } = await api.post("/api/contract", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    } catch (e) {
        const msg =
            e?.response?.data?.message ||
            e?.response?.data ||
            e?.message ||
            "Tạo hợp đồng thất bại";
        const err = new Error(msg);
        err.raw = e;
        throw err;
    }
}

export async function getAllContracts({
    orderId,
    status,
    method,
    branchId,
    buyerId,
    sellerId,
    createdFrom,
    createdTo,
    signedFrom,
    signedTo,
    effectiveFrom,
    effectiveTo,
    q,
    sort = "createdAt",
    dir = "desc",
    page = 0,
    size = 10,
    orderNo,
    orderNoLike = false,
} = {}) {
    const params = new URLSearchParams();

    const add = (key, value) => {
        if (value === undefined || value === null || value === "") return;
        params.append(key, value);
    };

    add("orderId", orderId);
    add("status", status);
    add("method", method);
    add("branchId", branchId);
    add("buyerId", buyerId);
    add("sellerId", sellerId);
    add("createdFrom", createdFrom);
    add("createdTo", createdTo);
    add("signedFrom", signedFrom);
    add("signedTo", signedTo);
    add("effectiveFrom", effectiveFrom);
    add("effectiveTo", effectiveTo);
    add("q", q);
    add("sort", sort);
    add("dir", dir);
    add("page", page);
    add("size", size);
    add("orderNo", orderNo);
    add("orderNoLike", orderNoLike);

    try {
        const { data } = await api.get(`/api/contract?${params.toString()}`);
        return data;
    } catch (e) {
        const msg =
            e?.response?.data?.message ||
            e?.response?.data ||
            e?.message ||
            "Lấy danh sách hợp đồng thất bại";
        const err = new Error(msg);
        err.raw = e;
        throw err;
    }
}

export const updateContract = async (id, data = {}, file) => {
    const payload = {
        status: data.status ?? null,
        effectiveFrom: toLocalLdt(data.effectiveFrom),
        effectiveTo: toLocalLdt(data.effectiveTo),
        note: data.note ?? null,
    };

    const form = new FormData();
    form.append("payload", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (file) form.append("file", file);

    console.log(payload);

    const { data: res } = await api.put(`${BASE}/${id}`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    return res;
};
