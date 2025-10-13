import { get } from "@/utils/apiCaller";

/**
 * Lấy danh sách tất cả listing với phân trang
 * @param {Object} params - Tham số phân trang và sắp xếp
 * @param {number} params.page - Trang hiện tại (bắt đầu từ 0)
 * @param {number} params.size - Số lượng item mỗi trang
 * @param {string} params.sort - Trường sắp xếp
 * @param {string} params.dir - Hướng sắp xếp (asc/desc)
 * @returns {Promise<Object>} Response từ API
 */
export const getAllListings = async (params = {}) => {
  const defaultParams = {
    page: 0,
    size: 10,
    sort: "createdAt",
    dir: "desc",
    ...params,
  };

  return await get("/api/listing/all", defaultParams);
};

/**
 * Tìm kiếm listing theo từ khóa
 * @param {Object} params - Tham số tìm kiếm
 * @param {string} params.key - Từ khóa tìm kiếm
 * @param {number} params.page - Trang hiện tại (bắt đầu từ 0)
 * @param {number} params.size - Số lượng item mỗi trang
 * @param {string} params.sort - Trường sắp xếp
 * @param {string} params.dir - Hướng sắp xếp (asc/desc)
 * @returns {Promise<Object>} Response từ API
 */
export const searchListings = async (params = {}) => {
  const defaultParams = {
    key: "",
    page: 0,
    size: 10,
    sort: "createdAt",
    dir: "desc",
    ...params,
  };

  // API search yêu cầu key trực tiếp trong query string
  return await get("/api/listing/search", {
    key: defaultParams.key,
    page: defaultParams.page,
    size: defaultParams.size,
    sort: defaultParams.sort,
    dir: defaultParams.dir,
  });
};

/**
 * Lấy danh sách listing mới nhất cho trang chủ
 * @param {number} limit - Số lượng item muốn lấy
 * @returns {Promise<Array>} Danh sách listing mới nhất
 */
export const getLatestListings = async (limit = 8) => {
  try {
    const response = await getAllListings({
      page: 0,
      size: limit,
      sort: "createdAt",
      dir: "desc",
    });

    if (response?.success && response?.data?.items) {
      return response.data.items.map(transformListingData);
    }

    return [];
  } catch (error) {
    console.error("Error fetching latest listings:", error);
    return [];
  }
};

/**
 * Lấy danh sách listing nổi bật cho trang chủ
 * @param {number} limit - Số lượng item muốn lấy
 * @returns {Promise<Array>} Danh sách listing nổi bật
 */
export const getFeaturedListings = async (limit = 8) => {
  try {
    const response = await getAllListings({
      page: 0,
      size: limit * 2, // Lấy nhiều hơn để filter
      sort: "createdAt",
      dir: "desc",
    });

    if (response?.success && response?.data?.items) {
      // Filter và sắp xếp theo tiêu chí nổi bật
      const featuredItems = response.data.items
        .filter(
          (item) =>
            item.status === "ACTIVE" &&
            (item.visibility === "BOOSTED" || item.isConsigned === true)
        )
        .sort((a, b) => {
          // Ưu tiên BOOSTED trước, sau đó theo thời gian tạo
          if (a.visibility === "BOOSTED" && b.visibility !== "BOOSTED")
            return -1;
          if (b.visibility === "BOOSTED" && a.visibility !== "BOOSTED")
            return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, limit);

      return featuredItems.map(transformListingData);
    }

    return [];
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }
};

/**
 * Lấy tổng số listing để hiển thị ở nút "Xem tất cả"
 * @returns {Promise<number>} Tổng số listing
 */
export const getTotalListingsCount = async () => {
  try {
    const response = await getAllListings({
      page: 0,
      size: 1,
    });

    if (response?.success && response?.data) {
      // Nếu có hasNext, có thể estimate tổng số
      // Hoặc có thể gọi API khác để lấy count chính xác
      return response.data.items.length > 0 ? 100 : 0; // Placeholder
    }

    return 0;
  } catch (error) {
    console.error("Error fetching total listings count:", error);
    return 0;
  }
};

/**
 * Transform dữ liệu từ API về format phù hợp với component
 * @param {Object} apiItem - Item từ API response
 * @returns {Object} Item đã transform
 */
const transformListingData = (apiItem) => {
  // Parse mediaListUrl từ string thành array
  const parseMediaUrls = (mediaListUrl) => {
    if (!mediaListUrl) return [];

    // Nếu là array, flatten và split từng string
    if (Array.isArray(mediaListUrl)) {
      return mediaListUrl
        .flatMap((urlString) => urlString.split(","))
        .map((url) => url.trim())
        .filter((url) => url && url.startsWith("http"));
    }

    // Nếu là string, split trực tiếp
    if (typeof mediaListUrl === "string") {
      return mediaListUrl
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url && url.startsWith("http"));
    }

    return [];
  };

  return {
    id: apiItem.id?.toString() || "",
    title: apiItem.title || "",
    category: determineCategory(apiItem.brand, apiItem.model),
    brand: apiItem.brand || "",
    model: apiItem.model || "",
    year: apiItem.year || null,
    batteryCapacityKwh: apiItem.batteryCapacityKwh || null,
    sohPercent: apiItem.sohPercent || null,
    mileageKm: apiItem.mileageKm ? parseInt(apiItem.mileageKm) : null,
    powerKw: null, // API không có field này, có thể tính từ batteryCapacityKwh
    price: apiItem.price || 0,
    province: apiItem.province || "",
    city: "", // API không có field city riêng
    status: apiItem.status || "ACTIVE",
    visibility: apiItem.visibility || "NORMAL",
    verified: apiItem.isConsigned || false, // Sử dụng isConsigned làm verified
    isConsigned: apiItem.isConsigned || false,
    branchId: null, // API không có field này
    images: parseMediaUrls(apiItem.mediaListUrl),
    createdAt: apiItem.createdAt || new Date().toISOString(),
    sellerName: apiItem.sellerName || "",
  };
};

/**
 * Xác định category dựa trên brand và model
 * @param {string} brand - Thương hiệu
 * @param {string} model - Model
 * @returns {string} Category
 */
const determineCategory = (brand, model) => {
  const brandLower = (brand || "").toLowerCase();
  const modelLower = (model || "").toLowerCase();

  // Logic xác định category dựa trên brand/model
  if (
    brandLower.includes("tesla") ||
    brandLower.includes("vinfast") ||
    brandLower.includes("byd") ||
    brandLower.includes("nissan")
  ) {
    return "EV_CAR";
  }

  if (
    brandLower.includes("yamaha") ||
    brandLower.includes("honda") ||
    brandLower.includes("dat bike")
  ) {
    return "E_MOTORBIKE";
  }

  if (brandLower.includes("giant") || brandLower.includes("trek")) {
    return "E_BIKE";
  }

  if (
    modelLower.includes("battery") ||
    modelLower.includes("pin") ||
    modelLower.includes("pack")
  ) {
    return "BATTERY";
  }

  return "EV_CAR"; // Default
};
