import api from "@utils/apiCaller";
import { get, put, remove } from "@/utils/apiCaller";

export const getAllCategoryDetail = async ({ activeOnly = true } = {}) => {
  const res = await api.get("/api/category/all/detail", {
    params: { activeOnly },
    validateStatus: () => true,
  });
  const { status, data } = res ?? {};
  if (status !== 200 || !data) {
    throw new Error(data?.message || `Request failed (${status})`);
  }

  // BE có thể trả array trực tiếp hoặc bọc data
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : null;
  if (!arr) {
    if (import.meta?.env?.DEV)
      console.warn("categoryService: unexpected payload", data);
    return [];
  }
  return arr;
};

// Lấy tất cả danh mục
export const getAllCategories = async () => {
  return await get("/api/category/all");
};

// Cập nhật danh mục
export const updateCategory = async (id, payload) => {
  return await put(`/api/category/update/${id}`, payload);
};

// Ẩn danh mục (xóa mềm)
export const hideCategory = async (id) => {
  return await remove(`/api/category/delete/${id}`);
};
