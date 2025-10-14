import { get, patch } from "@utils/apiCaller";

// Get staff listing list
export const getStaffListings = (params = {}) => {
  const {
    page = 0,
    size = 10,
    sort = "",
    dir = "desc",
    status,
    category,
    dateFrom,
    dateTo,
  } = params;
  const queryParams = { page, size };

  if (sort && sort.trim()) {
    queryParams.sort = sort;
    queryParams.dir = dir;
  }

  if (status) queryParams.status = status;
  if (category) queryParams.category = category;
  if (dateFrom) queryParams.dateFrom = dateFrom;
  if (dateTo) queryParams.dateTo = dateTo;

  return get("/api/staff/listing", queryParams);
};

// Search staff listings with advanced filters
export const searchStaffListings = (params = {}) => {
  const {
    keyword,
    page = 0,
    size = 10,
    sort = "",
    dir = "desc",
    category,
    dateFrom,
    dateTo,
    yearFrom,
    yearTo,
    capacityMin,
    capacityMax,
    priceMin,
    priceMax,
    mileageMin,
    mileageMax,
    sohMin,
    sohMax,
  } = params;

  // Build requestDTO object for search API
  const requestDTO = {};
  if (keyword) requestDTO.key = keyword;
  if (yearFrom) requestDTO.yearFrom = yearFrom;
  if (yearTo) requestDTO.yearTo = yearTo;
  if (capacityMin !== undefined) requestDTO.capacityMin = capacityMin;
  if (capacityMax !== undefined) requestDTO.capacityMax = capacityMax;
  if (priceMin !== undefined) requestDTO.priceMin = priceMin;
  if (priceMax !== undefined) requestDTO.priceMax = priceMax;
  if (mileageMin !== undefined) requestDTO.mileageMin = mileageMin;
  if (mileageMax !== undefined) requestDTO.mileageMax = mileageMax;
  if (sohMin !== undefined) requestDTO.sohMin = sohMin;
  if (sohMax !== undefined) requestDTO.sohMax = sohMax;

  const queryParams = {
    page,
    size,
  };

  // Add keyword directly as query parameter if it exists
  if (keyword) {
    queryParams.key = keyword;
  }

  // Add additional filters as query parameters
  if (category) queryParams.category = category;
  if (dateFrom) queryParams.dateFrom = dateFrom;
  if (dateTo) queryParams.dateTo = dateTo;

  if (sort && sort.trim()) {
    queryParams.sort = sort;
    queryParams.dir = dir;
  }

  return get("/api/staff/listing/search", queryParams);
};

// Get staff listing detail
export const getStaffListingDetail = async (id) => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }

  return await get(`/api/staff/listings/${id}`);
};

// Staff approve listing
export const approveStaffListing = (id, reason = "") => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }
  return patch(`/api/staff/listings/${id}/approve`, { reason });
};

// Từ chối listing (Staff reject)
export const rejectStaffListing = (id, reason = "") => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }
  if (!reason || !reason.trim()) {
    throw new Error("Lý do từ chối là bắt buộc");
  }
  return patch(`/api/staff/listings/${id}/reject`, { reason: reason.trim() });
};

// Kích hoạt lại listing đã bị từ chối
export const reactivateStaffListing = (id, reason = "") => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }
  return patch(`/api/staff/listings/${id}/reactivate`, { reason });
};

// Lấy thống kê listing cho Staff dashboard
export const getStaffListingStats = () => {
  return get("/api/staff/listings/stats");
};
