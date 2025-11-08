import api from "@/utils/apiCaller";

export const getConsignments = async (
  page = 0,
  size = 10,
  sort = "createdAt",
  dir = "desc"
) => {
  const endpoint = `/api/staff/consignment-request`;
  const params = {
    page,
    size,
    sort,
    dir,
  };
  const res = await api.get(endpoint, { params });

  return res.data;
};

export const getConsignmentsConsider = async (
  page = 0,
  size = 10,
  sort = "createdAt",
  dir = "desc"
) => {
  const endpoint = `/api/staff/consignment-request/consider`;
  const params = {
    page,
    size,
    sort,
    dir,
  };
  const res = await api.get(endpoint, { params });

  return res.data;
};

export const considerRejected = async (id, rejectedReason) => {
  const endpoint = `/api/staff/consignment-request/consider_rejected`;
  const body = {
    id,
    rejectedReason,
  };

  return await api.put(endpoint, body);
};

export const considerAccepted = async (id) => {
  const endpoint = `/api/staff/consignment-request/consider_accepted`;
  const body = {
    id,
  };

  return await api.put(endpoint, body);
};

export const getStaffInspectionSchedule = async (date, statuses = []) => {
  const res = await api.get("/api/staff/inspection_schedule", {
    params: { date, statuses },
  });
  return res.data;
};

export const checkInInspectionSchedule = async (id) => {
  const endpoint = `/api/inspection_schedule/${id}/check_in`;
  const res = await api.patch(endpoint);
  return res.data;
};

export const addInspection = async (
  requestId,
  inspectionSummary,
  suggestedPrice,
  result
) => {
  const endpoint = `/api/inspections/add`;
  const body = {
    requestId,
    inspectionSummary,
    suggestedPrice,
    result,
  };

  const res = await api.post(endpoint, body);
  return res.data;
};

export const getInspectionByRequestId = async (requestId) => {
  const endpoint = `/api/inspections/request/${requestId}`;
  const res = await api.get(endpoint);
  return res.data;
};

export const inactivateInspection = async (inspectionId) => {
  const endpoint = `/api/inspections/${inspectionId}/inactive`;
  const res = await api.put(endpoint);
  return res.data;
};

export const getStaffInspections = async () => {
  const res = await api.get(`/api/inspections/staff/all`);
  return res.data;
};

//Agreement
// /services/staff/staffConsignmentService.js
export const addAgreement = async (payload, file) => {
  const formData = new FormData();
  formData.append(
    "payload",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );
  formData.append("file", file);

  return api.post("/api/agreements/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export async function staffCreateListing(payload, images = [], videos = []) {
  const fd = new FormData();
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  fd.append("payload", blob);
  (images || []).forEach((f) => fd.append("images", f));
  (videos || []).forEach((f) => fd.append("videos", f));

  const res = await api.post("/api/listing/consignment", fd, {
    validateStatus: () => true,
    withCredentials: true,
    headers: {
      /* để browser tự set boundary */
    },
  });
  const ok =
    res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok)
    throw new Error(res?.data?.message || `Create failed (${res?.status})`);
  return res.data;
}

export async function updateConsignmentListing(
  listingId,
  payload,
  images = [],
  videos = [],
  keepMediaIds = null
) {
  const fd = new FormData();
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  fd.append("payload", blob);

  (images || []).forEach((f) => fd.append("images", f));
  (videos || []).forEach((f) => fd.append("videos", f));

  if (Array.isArray(keepMediaIds)) {
    keepMediaIds.forEach((id) => fd.append("keepMediaIds", String(id)));
  }

  const res = await api.put(`/api/listing/consignment/${listingId}`, fd, {
    validateStatus: () => true,
    withCredentials: true,
    headers: {
      /* để browser tự set boundary */
    },
  });
  const ok =
    res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok)
    throw new Error(res?.data?.message || `Update failed (${res?.status})`);
  return res.data;
}

//Sale order
export const createOrder = async (listingId, buyerPhoneNumber) => {
  const body = {
    listingId,
    buyerPhoneNumber,
  };
  return await api.post("/api/order", body);
};
