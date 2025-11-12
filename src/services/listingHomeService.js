import { get } from "@/utils/apiCaller";

// Lấy danh sách tất cả listing với phân trang
export const getAllListings = async (params = {}) => {
  const defaultParams = {
    page: 0,
    size: 10,
    sort: "createdAt",
    dir: "desc",
    ...params,
  };

  return await get("/api/listing/", defaultParams);
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

  // Chỉ gửi các params có giá trị
  const queryParams = {};
  Object.keys(defaultParams).forEach((key) => {
    const value = defaultParams[key];
    if (value !== undefined && value !== null && value !== "") {
      queryParams[key] = value;
    }
  });

  return await get("/api/listing/search", queryParams);
};

// Lấy danh sách listing mới nhất cho trang chủ
export const getLatestListings = async (limit = 10) => {
  try {
    const response = await getAllListings({
      page: 0,
      size: limit * 2, // Lấy nhiều hơn để filter
      // Backend chấp nhận sort theo "createdAt"
      sort: "createdAt",
      dir: "desc",
    });

    console.log("🔍 API Response - Latest Listings:", response);
    console.log("📊 Items count:", response?.data?.items?.length);
    console.log("📦 First item:", response?.data?.items?.[0]);

    if (response?.success && response?.data?.items) {
      // Loại bỏ tin ký gửi (isConsigned = true)
      const nonConsignedItems = response.data.items
        .filter((item) => !item.isConsigned)
        .slice(0, limit);

      console.log("✅ Non-consigned items:", nonConsignedItems.length);

      return nonConsignedItems.map(transformListingData);
    }

    return [];
  } catch (error) {
    console.error("Error fetching latest listings:", error);
    return [];
  }
};

// Lấy danh sách listing nổi bật cho trang chủ
export const getFeaturedListings = async (limit = 10) => {
  try {
    const response = await getAllListings({
      page: 0,
      // Lấy một trang lớn để tránh bị thiếu BOOSTED do filter phía client
      size: 200,
      sort: "createdAt",
      dir: "desc",
    });

    console.log("🌟 API Response - Featured Listings (Raw):", response);
    console.log("📊 Total items fetched:", response?.data?.items?.length);

    if (response?.success && response?.data?.items) {
      // Chỉ lấy tin BOOSTED, sắp xếp mới nhất
      const featuredItems = response.data.items
        .filter(
          (item) => item.status === "ACTIVE" && item.visibility === "BOOSTED"
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);

      console.log(
        "✨ Featured items after filter (ACTIVE + BOOSTED):",
        featuredItems.length
      );
      console.log("🎯 First featured item:", featuredItems[0]);

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

// Lấy danh sách tin đăng ký gửi (isConsigned = true)
export const getConsignmentListings = async ({
  page = 0,
  size = 20,
  sort = "createdAt",
  dir = "desc",
} = {}) => {
  try {
    // Lấy nhiều hơn để filter
    const response = await getAllListings({
      page,
      size: size * 2,
      sort,
      dir,
    });

    console.log("🚗 API Response - Consignment Listings:", response);

    if (response?.success && response?.data) {
      // Filter chỉ lấy tin ký gửi
      const consignedItems = response.data.items.filter(
        (item) => item.isConsigned === true && item.status === "ACTIVE"
      );

      console.log("✅ Consigned items filtered:", consignedItems.length);

      return {
        items: consignedItems.slice(0, size).map(transformListingData),
        totalElements: consignedItems.length,
        totalPages: Math.ceil(consignedItems.length / size),
        hasNext: consignedItems.length > size,
        hasPrevious: page > 0,
        page: page,
        size: size,
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
const transformListingData = (apiItem) => {
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

  const base = {
    id: String(listing?.id ?? ""),
    title:
      listing?.title ||
      `${listing?.brand ?? ""} ${listing?.model ?? ""}`.trim(),
    category:
      mapCategoryIdToName(listing?.categoryId) ||
      listing?.categoryName ||
      "EV_CAR",
    category_id:
      typeof listing?.categoryId === "number" ? listing?.categoryId : undefined,
    brand: listing?.brand || "",
    model: listing?.model || "",
    year: listing?.year ?? null,
    batteryCapacityKwh: listing?.batteryCapacityKwh ?? null,
    sohPercent: listing?.sohPercent ?? null,
    mileageKm: listing?.mileageKm ?? null,
    powerKw: null,
    price: listing?.price ?? 0,
    description:
      typeof listing?.description === "string" ? listing.description : "",
    province: listing?.province || "",
    city: listing?.district || "",
    status: listing?.status || "ACTIVE",
    visibility: listing?.visibility || "NORMAL",
    verified: !!listing?.verified,
    isConsigned: !!listing?.isConsigned,
    images,
    videos,
    createdAt: listing?.updatedAt || new Date().toISOString(),
    seller: {
      id: seller?.id,
      fullName: profile?.fullName || "",
      avatarUrl: profile?.avatarUrl || "",
      province: profile?.province || "",
      addressLine: profile?.addressLine || "",
      phoneNumber: seller?.phoneNumber,
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
        capacityKwh: productBattery?.batteryCapacityKwh,
        voltage: productBattery?.voltage,
        weightKg: productBattery?.massKg,
        dimension: productBattery?.dimensions,
        chemistry: productBattery?.batteryChemistry,
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
        }
      : null,
    // Gán các thông số kỹ thuật tổng hợp từ productVehicle nếu có
    powerKw:
      productVehicle && productVehicle.motorPowerKw != null
        ? productVehicle.motorPowerKw
        : base.powerKw,
    batteryCapacityKwh:
      productVehicle && productVehicle.batteryCapacityKwh != null
        ? productVehicle.batteryCapacityKwh
        : base.batteryCapacityKwh,
  };
};
