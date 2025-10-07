import { get, patch } from "@utils/apiCaller";

// Temporary: Import fake data until API is ready
import { fakeGetOne } from "@/data/admin/manageListing.fake";

// Get staff listing list
export const getStaffListings = (params = {}) => {
  const {
    page = 0,
    size = 10,
    sort = "",
    dir = "desc",
    status,
    category,
  } = params;
  const queryParams = { page, size };

  if (sort && sort.trim()) {
    queryParams.sort = sort;
    queryParams.dir = dir;
  }

  if (status) queryParams.status = status;
  if (category) queryParams.category = category;

  return get("/api/staff/listings/", queryParams);
};

// Search staff listings
export const searchStaffListings = (params = {}) => {
  const { keyword, page = 0, size = 10, sort = "", dir = "desc" } = params;
  const queryParams = { keyword, page, size };

  if (sort && sort.trim()) {
    queryParams.sort = sort;
    queryParams.dir = dir;
  }

  return get("/api/staff/listings/search", queryParams);
};

// Get staff listing detail (with fallback to fake data)
export const getStaffListingDetail = async (id) => {
  if (!id) {
    throw new Error("ID listing là bắt buộc");
  }

  try {
    // Try real API first
    return await get(`/api/staff/listings/${id}`);
  } catch (error) {
    console.warn("API failed, using fake data:", error.message);

    // Fallback to fake data
    const fakeData = await fakeGetOne(id);
    if (!fakeData) {
      throw new Error("Không tìm thấy bài đăng");
    }

    // Return fake data directly (fakeGetOne already returns the item)
    return fakeData;
  }
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
