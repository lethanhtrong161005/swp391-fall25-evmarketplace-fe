import { get, put, post, remove } from "@/utils/apiCaller";

// Lấy danh sách tất cả model
export const getAllModels = async () => {
  return await get("/api/model/all");
};

// Thêm model mới
export const addModel = async (payload) => {
  return await post("/api/model/add", payload);
};

// Cập nhật model
export const updateModel = async (id, payload) => {
  return await put(`/api/model/update/${id}`, payload);
};

// Xóa model
export const deleteModel = async (id) => {
  return await remove(`/api/model/delete/${id}`);
};