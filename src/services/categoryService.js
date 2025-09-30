
// src/services/categoryService.js
import api from "@utils/apiCaller";

export const getAllCategoryDetail = async () => {
    const res = await api.get("/api/category/all/detail", { validateStatus: () => true });

    // Kiểm tra HTTP & payload
    if (res?.status !== 200 || !res?.data) {
        throw new Error(res?.data?.message || `Request failed (${res?.status})`);
    }
    // API mẫu của bạn: { status, success, message, data: [...] }
    const arr = res.data?.data;
    if (!Array.isArray(arr)) {
        // log để debug khi BE đổi schema
        console.warn("categoryService: unexpected payload", res.data);
        return []; // để UI không crash
    }
    return arr;
};