import api from "@utils/apiCaller";

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
