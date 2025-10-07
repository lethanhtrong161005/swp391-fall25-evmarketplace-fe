import { get, put, post } from "@/utils/apiCaller";

// Lấy tất cả sản phẩm xe 
export const getAllVehicles = async () => {
 return get("/api/product/vehicle/all");
};

// Thêm xe mới
export const addVehicle = async (payload) => {
  return await post("/api/product/vehicle/add", payload);
};

// Cập nhật xe
export const updateVehicle = async (id, payload) => {
  return await put(`/api/product/vehicle/update/${id}`, payload);
};