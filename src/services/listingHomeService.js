import { get } from "@/utils/apiCaller";

// Các trường được phép sort theo backend (ListingController line 92-93)
export const ALLOWED_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "price",
  "expiresAt",
  "promotedUntil",
  "batteryCapacityKwh",
];

// Validate và normalize sort field
const validateSortField = (sortField) => {
  if (!sortField || !ALLOWED_SORT_FIELDS.includes(sortField)) {
    return "createdAt"; // Fallback về createdAt nếu không hợp lệ
  }
  return sortField;
};

// Validate và normalize sort direction
const validateSortDirection = (dir) => {
  return dir === "asc" ? "asc" : "desc"; // Mặc định desc
};

// Lấy danh sách tất cả listing với phân trang
export const getAllListings = async (params = {}) => {
  const defaultParams = {
    page: 0,
    size: 10,
    sort: "createdAt",
    dir: "desc",
    ...params,
  };

  // Validate sort field và direction trước khi gửi
  defaultParams.sort = validateSortField(defaultParams.sort);
  defaultParams.dir = validateSortDirection(defaultParams.dir);

  const response = await get("/api/listing/", defaultParams);

  return response;
};

// Tìm kiếm listing với đầy đủ filters
export const searchListings = async (params = {}) => {
  const defaultParams = {
    page: 0,
    size: 10,
    sort: "createdAt",
    dir: "desc",
    ...params,
  };

  // Validate sort field và direction trước khi gửi (luôn validate, không điều kiện)
  defaultParams.sort = validateSortField(defaultParams.sort);
  defaultParams.dir = validateSortDirection(defaultParams.dir);

  // Chỉ gửi các params có giá trị
  const queryParams = {};
  Object.keys(defaultParams).forEach((key) => {
    const value = defaultParams[key];
    if (value !== undefined && value !== null && value !== "") {
      queryParams[key] = value;
    }
  });

  const response = await get("/api/listing/search", queryParams);

  return response;
};

// Lấy danh sách listing mới nhất cho trang chủ
// Hiển thị tất cả tin ACTIVE (không filter isConsign, không filter isBoosted)
export const getLatestListings = async (limit = 10) => {
  try {
    const response = await getAllListings({
      page: 0,
      size: limit,
      sort: "createdAt",
      dir: "desc",
    });

    if (response?.success && response?.data?.items) {
      // Chỉ lấy tin có status ACTIVE
      const activeItems = response.data.items
        .filter((item) => item.status === "ACTIVE")
        .slice(0, limit);

      return activeItems.map(transformListingData);
    }

    return [];
  } catch (error) {
    console.error("Error fetching latest listings:", error);
    return [];
  }
};

// Lấy danh sách listing nổi bật cho trang chủ
// Chỉ hiển thị tin có isBoosted = true và status = ACTIVE
export const getFeaturedListings = async (limit = 10) => {
  try {
    const response = await getAllListings({
      page: 0,
      size: limit,
      sort: "createdAt",
      dir: "desc",
      isBoosted: true, // Chỉ lấy tin nổi bật
    });

    if (response?.success && response?.data?.items) {
      // Lọc chỉ lấy ACTIVE (isBoosted đã được filter từ backend)
      const featuredItems = response.data.items
        .filter((item) => item.status === "ACTIVE")
        .slice(0, limit);

      return featuredItems.map(transformListingData);
    }

    return [];
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }
};

// Lấy tổng số listing để hiển thị ở nút "Xem tất cả"
export const getTotalListingsCount = async () => {
  try {
    const response = await getAllListings({
      page: 0,
      size: 1,
    });

    if (response?.success && response?.data) {
      // BE trả về totalElements trong PageResponse
      return response.data.totalElements || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error fetching total listings count:", error);
    return 0;
  }
};

// Lấy danh sách phương tiện (VEHICLE) - Xe đạp, xe máy, ô tô
export const getVehicleListings = async ({
  page = 0,
  size = 10,
  sort = "createdAt",
  dir = "desc",
} = {}) => {
  try {
    const response = await getAllListings({
      type: "VEHICLE",
      page,
      size,
      sort,
      dir,
    });

    if (response?.success && response?.data) {
      return {
        items: response.data.items.map(transformListingData),
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        hasNext: response.data.hasNext || false,
        hasPrevious: response.data.hasPrevious || false,
        page: response.data.page || page,
        size: response.data.size || size,
      };
    }

    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      page: 0,
      size,
    };
  } catch (error) {
    console.error("Error fetching vehicle listings:", error);
    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      page: 0,
      size,
    };
  }
};

// Lấy danh sách pin (BATTERY)
export const getBatteryListings = async ({
  page = 0,
  size = 10,
  sort = "createdAt",
  dir = "desc",
} = {}) => {
  try {
    const response = await getAllListings({
      type: "BATTERY",
      page,
      size,
      sort,
      dir,
    });

    if (response?.success && response?.data) {
      return {
        items: response.data.items.map(transformListingData),
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        hasNext: response.data.hasNext || false,
        hasPrevious: response.data.hasPrevious || false,
        page: response.data.page || page,
        size: response.data.size || size,
      };
    }

    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      page: 0,
      size,
    };
  } catch (error) {
    console.error("Error fetching battery listings:", error);
    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      page: 0,
      size,
    };
  }
};

// Lấy danh sách tin đăng ký gửi (isConsign = true)
export const getConsignmentListings = async ({
  page = 0,
  size = 20,
  sort = "createdAt",
  dir = "desc",
} = {}) => {
  try {
    // Gọi API với parameter isConsign = true để backend filter
    const response = await getAllListings({
      page,
      size,
      sort,
      dir,
      isConsign: true, // Filter tin ký gửi từ backend
    });

    if (response?.success && response?.data) {
      return {
        items: response.data.items.map(transformListingData),
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        hasNext: response.data.hasNext || false,
        hasPrevious: response.data.hasPrevious || false,
        page: response.data.page || page,
        size: response.data.size || size,
      };
    }

    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      page: 0,
      size,
    };
  } catch (error) {
    console.error("Error fetching consignment listings:", error);
    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      page: 0,
      size,
    };
  }
};

// Lấy chi tiết listing công khai ở trang Home/Detail
export const getListingDetail = async (id) => {
  if (id == null) return null;
  try {
    const res = await get(`/api/listing/${id}`);
    if (res?.success && res?.data) {
      return transformListingDetail(res.data);
    }
    return null;
  } catch (e) {
    console.error("Error fetching listing detail:", e);
    return null;
  }
};

// Transform dữ liệu từ API về format phù hợp với component
export const transformListingData = (apiItem) => {
  // Xử lý thumbnailUrl từ API response mới
  const getThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) return "";

    const url = String(thumbnailUrl).trim();
    if (!url) return "";

    // Nếu đã là full URL thì giữ nguyên
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Nếu chưa có base URL, thêm vào
    const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE}${cleanUrl}`;
  };

  return {
    id: apiItem.id?.toString() || "",
    title: apiItem.title || "",
    // category string ưu tiên theo categoryId backend trả
    category:
      mapCategoryIdToName(apiItem.categoryId) ||
      determineCategory(apiItem.brand, apiItem.model),
    category_id:
      typeof apiItem.categoryId === "number" ? apiItem.categoryId : undefined,
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
    thumbnailUrl: getThumbnailUrl(apiItem.thumbnailUrl),
    images: [], // Không còn sử dụng images array cho listing list
    createdAt: apiItem.createdAt || new Date().toISOString(),
    sellerName: apiItem.sellerName || "",
  };
};

// Xác định category dựa trên brand và model
const mapCategoryIdToName = (id) => {
  switch (id) {
    case 1:
      return "EV_CAR";
    case 2:
      return "E_MOTORBIKE";
    case 3:
      return "E_BIKE";
    case 4:
      return "BATTERY";
    default:
      return undefined;
  }
};

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

// Helper function: Ưu tiên giá trị người dùng nhập, nếu null/undefined/empty thì lấy từ catalog
const getValueWithFallback = (userValue, catalogValue) => {
  // Nếu userValue có giá trị (không null, undefined, empty string), dùng userValue
  if (userValue != null && userValue !== "") {
    return userValue;
  }
  // Ngược lại, dùng catalogValue
  return catalogValue ?? null;
};

// Chuẩn hoá dữ liệu chi tiết cho trang ProductDetail
const transformListingDetail = (apiData) => {
  // apiData chính là ListingDetailResponseDto từ BE
  // BE trả: data: { listing: {...}, sellerId: {...}, media: [...], ... }
  const listing = apiData?.listing || {};
  const seller = apiData?.sellerId || {};
  const profile = seller?.profile || {};
  const productVehicle = apiData?.productVehicle || null;
  const productBattery = apiData?.productBattery || null;
  const media = Array.isArray(apiData?.media) ? apiData.media : [];

  const normalizeUrl = (u) => {
    if (typeof u !== "string") return "";

    // Nếu đã là full URL (http/https) thì giữ nguyên
    if (u.startsWith("http://") || u.startsWith("https://")) {
      return u;
    }

    // Nếu chưa có base URL, thêm vào
    const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    const cleanUrl = u.startsWith("/") ? u : `/${u}`;

    try {
      const raw = decodeURI(cleanUrl);
      return `${API_BASE}${raw.replace(/ /g, "%20")}`;
    } catch {
      return `${API_BASE}${String(cleanUrl).replace(/ /g, "%20")}`;
    }
  };

  const images = media
    .filter((m) => m?.mediaType === "IMAGE" && typeof m?.mediaUrl === "string")
    .map((m) => normalizeUrl(m.mediaUrl));

  const videos = media
    .filter((m) => m?.mediaType === "VIDEO" && typeof m?.mediaUrl === "string")
    .map((m) => normalizeUrl(m.mediaUrl));

  // Áp dụng logic ưu tiên: listing (user input) > catalog (productVehicle/productBattery)
  const brand = getValueWithFallback(
    listing?.brand,
    productVehicle?.brand || productBattery?.brand
  );
  const model = getValueWithFallback(
    listing?.model,
    productVehicle?.model || productBattery?.model
  );
  const year = getValueWithFallback(
    listing?.year,
    productVehicle?.releaseYear
  );
  const batteryCapacityKwh = getValueWithFallback(
    listing?.batteryCapacityKwh,
    productVehicle?.batteryCapacityKwh || productBattery?.capacityKwh || productBattery?.batteryCapacityKwh
  );
  const voltage = getValueWithFallback(
    listing?.voltage,
    productVehicle?.voltage || productBattery?.voltage
  );
  const batteryChemistry = getValueWithFallback(
    listing?.batteryChemistry,
    productBattery?.chemistry || productBattery?.batteryChemistry
  );
  const massKg = getValueWithFallback(
    listing?.massKg,
    productVehicle?.massKg || productVehicle?.weightKg || productBattery?.weightKg || productBattery?.massKg
  );
  const dimensions = getValueWithFallback(
    listing?.dimensions,
    productVehicle?.dimensions || productBattery?.dimension || productBattery?.dimensions
  );
  const powerKw = getValueWithFallback(
    null, // listing không có powerKw, chỉ có từ catalog
    productVehicle?.motorPowerKw
  );

  const base = {
    id: String(listing?.id ?? ""),
    title:
      listing?.title ||
      `${brand ?? ""} ${model ?? ""}`.trim(),
    category:
      mapCategoryIdToName(listing?.categoryId) ||
      listing?.categoryName ||
      "EV_CAR",
    categoryName: listing?.categoryName || "",
    category_id:
      typeof listing?.categoryId === "number" ? listing?.categoryId : undefined,
    brand: brand || "",
    model: model || "",
    year: year,
    color: listing?.color || null,
    batteryCapacityKwh: batteryCapacityKwh,
    sohPercent: listing?.sohPercent ?? null,
    mileageKm: listing?.mileageKm ?? null,
    powerKw: powerKw,
    price: listing?.price ?? 0,
    description:
      typeof listing?.description === "string" ? listing.description : "",
    province: listing?.province || "",
    district: listing?.district || "",
    ward: listing?.ward || "",
    address: listing?.address || "",
    city: listing?.district || "",
    status: listing?.status || "ACTIVE",
    visibility: listing?.visibility || "NORMAL",
    verified: !!listing?.verified,
    isConsigned: !!listing?.isConsigned,
    expiresAt: listing?.expiresAt || null,
    // Thông tin pin từ listing (ưu tiên) hoặc catalog (fallback)
    voltage: voltage,
    batteryChemistry: batteryChemistry,
    massKg: massKg,
    dimensions: dimensions,
    images,
    videos,
    createdAt:
      listing?.createdAt || listing?.updatedAt || new Date().toISOString(),
    updatedAt: listing?.updatedAt || null,
    seller: {
      id: seller?.id,
      fullName: profile?.fullName || "",
      avatarUrl: profile?.avatarUrl || "",
      province: profile?.province || "",
      addressLine: profile?.addressLine || "",
      phoneNumber: seller?.phoneNumber || listing?.sellerPhone,
      email: seller?.email,
    },
    listingExtra: {
      aiSuggestedPrice: listing?.aiSuggestedPrice,
      visibility: listing?.visibility,
    },
  };

  if (productBattery) {
    return {
      ...base,
      category: "BATTERY",
      productBattery: {
        // Ưu tiên giá trị từ listing (đã được xử lý ở base), sau đó mới lấy từ catalog
        capacityKwh: base.batteryCapacityKwh ?? productBattery?.capacityKwh ?? productBattery?.batteryCapacityKwh ?? null,
        voltage: base.voltage ?? productBattery?.voltage ?? null,
        weightKg: base.massKg ?? productBattery?.weightKg ?? productBattery?.massKg ?? null,
        dimension: base.dimensions ?? productBattery?.dimension ?? productBattery?.dimensions ?? null,
        chemistry: base.batteryChemistry ?? productBattery?.chemistry ?? productBattery?.batteryChemistry ?? null,
      },
    };
  }

  return {
    ...base,
    category: base.category === "BATTERY" ? "BATTERY" : "EV_CAR",
    productVehicle: productVehicle
      ? {
          brand: productVehicle?.brand,
          model: productVehicle?.model,
          releaseYear: productVehicle?.releaseYear,
          batteryCapacityKwh: productVehicle?.batteryCapacityKwh,
          motorPowerKw: productVehicle?.motorPowerKw,
          acChargingKw: productVehicle?.acChargingKw,
          dcChargingKw: productVehicle?.dcChargingKw,
          acConnector: productVehicle?.acConnector,
          dcConnector: productVehicle?.dcConnector,
          rangeKm: productVehicle?.rangeKm,
          voltage: productVehicle?.voltage,
          massKg: productVehicle?.massKg,
          weightKg: productVehicle?.weightKg,
          dimensions: productVehicle?.dimensions,
        }
      : null,
  };
};
