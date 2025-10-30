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

export const getInspections = async (status = [], isActive = undefined) => {
  const endpoint = "/api/inspections";
  const params = {};

  if (Array.isArray(status) && status.length > 0) {
    params.status = status;
  }
  if (typeof isActive === "boolean") {
    params.isActive = isActive;
  }

  const res = await api.get(endpoint, { params });
  return res.data;
};

//Agreement

export const addAgreement = async (
  requestId,
  commissionPercent,
  acceptablePrice,
  startAt,
  duration,
  depositPercent
) => {
  const endpoint = "/api/agreements/add";

  const body = {
    requestId,
    commissionPercent,
    acceptablePrice,
    startAt,
    duration,
    depositPercent,
  };

  const res = await api.post(endpoint, body);
  return res.data;
};