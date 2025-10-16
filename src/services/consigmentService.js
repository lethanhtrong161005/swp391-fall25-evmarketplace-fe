import { get, post } from "@/utils/apiCaller";

export const getAllConsignments = async (page = 0, size = 10, sort = "createdAt", dir = "desc") => {
  return await get("/api/consignments/all", {
    params: { page, size, sort, dir },
  });
};

export const addConsignment = async (payload, files = {}) => {
  const formData = new FormData();
  formData.append(
    "payload",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );

  if (files.images?.length) {
    files.images.forEach((file) => formData.append("images", file));
  }

  if (files.videos?.length) {
    files.videos.forEach((file) => formData.append("videos", file));
  }

  return await post("/api/consignments/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


