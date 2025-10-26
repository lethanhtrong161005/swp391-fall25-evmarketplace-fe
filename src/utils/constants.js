export const CATEGORIES = {
  EV_CAR: "Xe ô tô điện",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

export const BRANDS_BY_CATEGORY = {
  EV_CAR: [
    {
      value: "VinFast",
      label: "VinFast",
      models: ["VF e34", "VF3", "VF 8", "VF 9"],
    },
    { value: "Tesla", label: "Tesla", models: ["Model 3", "Model Y"] },
  ],
  E_MOTORBIKE: [{ value: "Yamaha", label: "Yamaha", models: ["Neo's"] }],
  E_BIKE: [{ value: "Giant", label: "Giant", models: ["Explore E+"] }],
  BATTERY: [
    { value: "VinES", label: "VinES", models: ["LFP42", "LFP60"] },
    { value: "CATL", label: "CATL", models: ["NMC52", "LFP58"] },
  ],
};

// Năm: từ hiện tại → 1980, thêm dòng “trước 1980” nếu cần
const now = new Date().getFullYear();
export const YEARS_EXTENDED = [
  ...Array.from({ length: now - 1980 + 1 }, (_, i) => {
    const y = now - i;
    return { label: `${y}`, value: y };
  }),
  { label: "trước năm 1980", value: 1979 }, 
];


export const CONSIGNMENT_STATUS_LABELS = {
    SUBMITTED: "Đã gửi yêu cầu",
    SCHEDULING: "Chờ lên lịch",
    SCHEDULED: "Đã lên lịch",
    RESCHEDULED: "Hẹn lại",
    INSPECTING: "Đang kiểm định",
    INSPECTED_PASS: "Kiểm định đạt",
    INSPECTED_FAIL: "Kiểm định không đạt",
    REQUEST_REJECTED: "Bị từ chối",
    FINISHED: "Hoàn thành",
    EXPIRED: "Hết hạn",
    CANCELLED: "Đã hủy",
  };

  export const CONSIGNMENT_STATUS_COLOR = {
    SUBMITTED: "blue",
    SCHEDULING: "processing",
    SCHEDULED: "gold",
    INSPECTING: "processing",
    INSPECTED_PASS: "green",
    INSPECTED_FAIL: "red",
    REQUEST_REJECTED: "volcano",
    FINISHED: "success",
    EXPIRED: "gray",
  };

  export const ITEM_TYPE = {
    VEHICLE: "Phương tiện",
    BATTERY: "Pin"
  }

  export const INSPECTION_STATUS_LABELS = {
  SCHEDULED: "Đã lên lịch",
  CHECKED_IN: "Đã check-in",
  NO_SHOW: "Vắng mặt",
  CANCELLED: "Đã hủy",
};

export const INSPECTION_STATUS_COLOR = {
  SCHEDULED: "gold",
  CHECKED_IN: "green",
  NO_SHOW: "gray",
  CANCELLED: "red",
};