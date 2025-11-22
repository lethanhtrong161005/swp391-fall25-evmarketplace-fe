// src/pages/Member/ProductDetail/utils/productConstants.js

export const PRODUCT_CATEGORIES = {
  EV_CAR: "EV_CAR", // Ô tô điện
  E_MOTORBIKE: "E_MOTORBIKE", // Xe máy điện
  E_BIKE: "E_BIKE", // Xe đạp điện
  BATTERY: "BATTERY", // Pin/pack
  UNKNOWN: "UNKNOWN",
};

export const CATEGORY_LABELS = {
  [PRODUCT_CATEGORIES.EV_CAR]: "Xe ô tô điện",
  [PRODUCT_CATEGORIES.E_MOTORBIKE]: "Xe máy điện",
  [PRODUCT_CATEGORIES.E_BIKE]: "Xe đạp điện",
  [PRODUCT_CATEGORIES.BATTERY]: "Pin và bộ sạc điện",
  [PRODUCT_CATEGORIES.UNKNOWN]: "Khác",
};

export const CATEGORY_TAG_COLORS = {
  [PRODUCT_CATEGORIES.EV_CAR]: "green", // Ô tô điện - màu xanh lá
  [PRODUCT_CATEGORIES.E_MOTORBIKE]: "blue", // Xe máy điện - màu xanh dương
  [PRODUCT_CATEGORIES.E_BIKE]: "cyan", // Xe đạp điện - màu xanh nhạt
  [PRODUCT_CATEGORIES.BATTERY]: "purple", // Pin/pack - màu tím
  [PRODUCT_CATEGORIES.UNKNOWN]: "default", // Khác - màu mặc định
};

export const VERIFICATION_STATUS = {
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
};

export const LISTING_VISIBILITY = {
  BOOSTED: "BOOSTED",
  NORMAL: "NORMAL",
};

export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
};

export const SPECIFICATION_LABELS = {
  // Common
  BRAND: "Thương hiệu",
  MODEL: "Model",
  SOH: "SOH",
  COLOR: "Màu sắc",
  CATEGORY: "Danh mục",

  // Battery specific
  CAPACITY: "Dung lượng",
  VOLTAGE: "Điện áp",
  WEIGHT: "Khối lượng",
  DIMENSION: "Kích thước",
  CHEMISTRY: "Hóa học pin",

  // Vehicle specific
  YEAR: "Năm sản xuất",
  MILEAGE: "Quãng đường",
  POWER: "Công suất",
  BATTERY_CAPACITY: "Dung lượng pin",
  RANGE: "Tầm hoạt động",
  AC_CHARGING: "Sạc AC",
  DC_CHARGING: "Sạc DC",
  AC_CONNECTOR: "Cổng AC",
  DC_CONNECTOR: "Cổng DC",
  
  // Bike specific
  MOTOR_LOCATION: "Vị trí động cơ",
  WHEEL_SIZE: "Kích thước bánh xe",
  BRAKE_TYPE: "Loại phanh",
  BIKE_WEIGHT: "Khối lượng xe",

  // Location
  ADDRESS: "Địa chỉ",
  DISTRICT: "Quận/Huyện",
  WARD: "Phường/Xã",
  PROVINCE: "Tỉnh/Thành phố",

  // Listing info
  EXPIRES_AT: "Ngày hết hạn",
  STATUS: "Trạng thái",
  VISIBILITY: "Hiển thị",
};
