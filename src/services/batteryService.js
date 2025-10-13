import { get, put, post } from "@/utils/apiCaller";

// Lấy danh sách tất cả pin
export const getAllBatteries = async () => {
  return await get("/api/product/battery/all");
};

// Thêm pin mới
export const addBattery = async (payload) => {
  return await post("/api/product/battery/add", payload);
};

// Cập nhật pin
export const updateBattery = async (id, payload) => {
  return await put(`/api/product/battery/update/${id}`, payload);
};
