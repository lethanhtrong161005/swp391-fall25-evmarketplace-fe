import api, { get, post } from "@/utils/apiCaller";

//Member
export const getAllConsignments = async (
  page = 0,
  size = 10,
  sort = "createdAt",
  dir = "desc"
) => {
  return await get("/api/consignments_request/all", {
    params: { page, size, sort, dir },
  });
};

export const getConsignmentById = async (id) => {
  return await get(`/api/consignments_request/${id}`);
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

  return await post("/api/consignments_request/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const cancelConsignment = async (requestId, cancelledReason) => {
  const body = {
    requestId,
    cancelledReason,
  };
  const res = await api.put(`/api/consignments_request/cancel`, body);
  return res;
};

export const updateConsignmentRequest = async (
  requestId,
  payload,
  images = [],
  videos = []
) => {
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  if (Array.isArray(images)) {
    images.forEach((file) => {
      formData.append("images", file);
    });
  }

  if (Array.isArray(videos)) {
    videos.forEach((file) => {
      formData.append("videos", file);
    });
  }

  return await api.put(
    `/api/consignments_request/update/${requestId}`,
    formData
  );
};

export const getMemberInspectionSchedule = async (requestId, statuses = []) => {
  const res = await api.get(
    `/api/inspection_schedule/inspection_schedule/${requestId}`,
    {
      params: { statuses },
    }
  );
  return res.data;
};

export const getInspectionAvailability = async (params) => {
  const res = await api.get("/api/inspection_schedule/availability", {
    params: params,
  });
  return res.data;
};

export const bookInspectionSchedule = async (payload) => {
  try {
    const res = await post("/api/inspection_schedule/booking", payload, {}, {
      "Content-Type": "application/json",
    });
    return res;
  } catch (err) {
    console.error("Error booking inspection schedule:", err);
    throw err;
  }
};


export const markCancelInspectionSchedule = async (id, reason = "Khách hàng vắng mặt") => {
  const endpoint = `/api/inspection_schedule/${id}/cancel`;
  const body = { reason };
  const res = await api.patch(endpoint, body);
  return res.data;
};

//Manager
export const getConsignmentsAssign = async (branchId) => {
  return await get(
    `/api/manager/branches/${branchId}/consignment-requests/assign`
  );
};

export const getConsignmentsManagement = async (
  branchId,
  page = 0,
  size = 10,
  sort = "createdAt",
  dir = "desc"
) => {
  return await get(
    `/api/manager/branches/${branchId}/consignment-request/ignore-submitted`,
    {
      params: { page, size, sort, dir },
    }
  );
};

export const assignStaffToConsignment = async (requestId, staffId) => {
  const res = await api.put(
    `/api/manager/consignment-requests/${requestId}/assign/${staffId}`
  );
  return res.data;
};


export const searchConsignmentByPhone = async (phone) => {
  if (!phone) throw new Error("Số điện thoại là bắt buộc để tìm kiếm.");
  const res = await api.get(`/api/consignments_request/search`, {
    params: { phone },
  });
  return res.data?.data || [];
};