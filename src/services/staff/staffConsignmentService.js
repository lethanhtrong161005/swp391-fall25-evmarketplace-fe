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

export const addInspection = async (requestId, inspectionSummary, suggestedPrice, result) => {
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
}

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

export const staffCreateListing = async (payload, images = [], videos = []) => {
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  if (Array.isArray(images)) {
    images.forEach((img) => {
      if (img && img.originFileObj) {
        formData.append("images", img.originFileObj);
      } else if (img instanceof File) {
        formData.append("images", img);
      }
    });
  }

  if (Array.isArray(videos)) {
    videos.forEach((vid) => {
      if (vid && vid.originFileObj) {
        formData.append("videos", vid.originFileObj);
      } else if (vid instanceof File) {
        formData.append("videos", vid);
      }
    });
  }

  const res = await api.post("/api/listing/consignment", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
