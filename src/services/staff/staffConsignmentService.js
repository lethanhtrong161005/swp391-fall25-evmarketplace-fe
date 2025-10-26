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
