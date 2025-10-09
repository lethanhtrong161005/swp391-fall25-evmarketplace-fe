import { get, put, post, remove } from "@/utils/apiCaller";

// Lấy danh sách tất cả brand
export const getAllBrands = async () => {
  return await get("/api/brand/all");
};

// Thêm brand mới
export const addBrand = async (payload) => {
  return await post("/api/brand/add", payload);
};

// Cập nhật brand
export const updateBrand = async (id, payload) => {
  return await put(`/api/brand/update/${id}`, payload);
};

// Xóa brand
export const deleteBrand = async (id) => {
  return await remove(`/api/brand/delete/${id}`);
};
