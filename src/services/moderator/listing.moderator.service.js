import api, { get, post, put } from "@utils/apiCaller";

// Lấy hàng đợi tin đăng chờ duyệt
export const getModeratorQueue = (params = {}) => {
  const { page = 0, size = 10, status = "PENDING", title = null } = params;

  const queryParams = { page, size, status };
  if (title) queryParams.title = title;

  return get("/api/moderator/listing/queue", queryParams);
};

// Lấy danh sách tin đang được khóa bởi moderator
export const getModeratorMyLocks = (params = {}) => {
  const { title = null } = params;
  const queryParams = {};
  if (title) queryParams.title = title;

  return get("/api/moderator/listing/my-locks", queryParams);
};

// Khóa tin đăng để duyệt
export const claimModeratorListing = (id, force = false) => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }

  const queryParams = {};
  if (force) queryParams.force = force;

  return post(`/api/moderator/listing/${id}/claim`, {}, queryParams);
};

// Nhả khóa tin đăng
export const releaseModeratorListing = (id, force = false) => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }

  const queryParams = {};
  if (force) queryParams.force = force;

  return post(`/api/moderator/listing/${id}/release`, {}, queryParams);
};

// Gia hạn thời gian khóa
export const extendModeratorListing = (id) => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }

  return post(`/api/moderator/listing/${id}/extend`);
};

// Duyệt tin đăng
export const approveModeratorListing = (id) => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }

  return put(`/api/moderator/listing/approve/${id}`);
};

// Từ chối tin đăng với lý do
export const rejectModeratorListing = async (id, reason, force = false) => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }
  if (!reason || !reason.trim()) {
    throw new Error("Lý do từ chối là bắt buộc");
  }

  const queryParams = {};
  if (force) queryParams.force = force;
  const result = await api.put(
    `/api/moderator/listing/reject/${id}`,
    { reason: reason.trim() },
    queryParams
  );
  return result.data;
};

// Lấy thông tin chi tiết tin đăng
export const getListingDetail = (listingId) => {
  if (!listingId) {
    throw new Error("ID listing là bắt buộc");
  }

  return get(`/api/listing/${listingId}`);
};

// Lấy lịch sử duyệt tin đăng
export const getModeratorHistory = (params = {}) => {
  const {
    q = "",
    actorId = null,
    fromTs = null,
    toTs = null,
    toStatuses = [],
    page = 0,
    size = 10,
  } = params;

  const queryParams = { page, size };

  if (q) queryParams.q = q;
  if (actorId) queryParams.actorId = actorId;
  if (fromTs) queryParams.fromTs = fromTs;
  if (toTs) queryParams.toTs = toTs;
  if (toStatuses && toStatuses.length > 0) {
    queryParams.toStatuses = toStatuses.join(",");
  }

  return get("/api/moderator/history", queryParams);
};
