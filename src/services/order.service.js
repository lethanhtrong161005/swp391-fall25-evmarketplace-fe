import api from "@utils/apiCaller";

const BASE = "/api/order";

export const getAllOrderByStaff = async ({ params } = {}) => {
    const { data: res } = await api.get(`${BASE}`, { params }); 

    if (res?.data && Array.isArray(res.data.items)) {
        return {
            items: res.data.items,
            total: res.data.totalElements ?? 0,
            page: (res.data.page ?? 0),       
            size: (res.data.size ?? params?.size ?? 10),
            totalPages: res.data.totalPages ?? 0,
            hasNext: !!res.data.hasNext,
            hasPrevious: !!res.data.hasPrevious,
        };
    }

    if (Array.isArray(res?.data)) {
        return {
            items: res.data,
            total: res.data.length,
            page: params?.page ?? 0,
            size: params?.size ?? 10,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
        };
    }

    return { items: [], total: 0, page: 0, size: params?.size ?? 10, totalPages: 0, hasNext: false, hasPrevious: false };
};

export async function payOrderCash({ orderId, method = "CASH", amountVnd, referenceNo, note }) {
  const { data: res } = await api.post(
    `/api/payment/${orderId}`,
    { method, amountVnd, referenceNo, note }
  );
  return res;
}

