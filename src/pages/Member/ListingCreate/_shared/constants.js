export const CATEGORIES = {
  EV_CAR: "EV_CAR",
  E_MOTORBIKE: "E_MOTORBIKE",
  E_BIKE: "E_BIKE",
  BATTERY: "BATTERY",
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
  { label: "trước năm 1980", value: 1979 }, // chuẩn hoá về 1979 để BE lưu SMALLINT
];
