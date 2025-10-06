 

/**
 * Fake data cho trang Admin/Manage Listing
 * - Phủ cả XE (EV_CAR/E_MOTORBIKE/E_BIKE) & PIN (BATTERY)
 * - Mỗi listing có 1-10 ảnh từ Picsum (seed ổn định)
 * - Bám các field chính của bảng 'listing' + phần hiển thị FE
 *
 * Ghi chú ảnh:
 *  Dùng Picsum seed để ảnh ổn định giữa các lần reload:
 *  https://picsum.photos/seed/<seed>/<w>/<h>
 *  Tài liệu: https://picsum.photos/  (Static Random Image /seed)  ✅
 */

const CATEGORIES = ["EV_CAR", "E_MOTORBIKE", "E_BIKE", "BATTERY"];
const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô điện",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const STATUSES = [
  "PENDING", // Đang chờ
  "APPROVED", // Đã duyệt
  "ACTIVE", // Đang hiển thị
  "RESERVED", // Đã giữ chỗ
  "SOLD", // Đã bán
  "EXPIRED", // Hết hạn
  "REJECTED", // Từ chối
  "ARCHIVED", // Lưu trữ
];

const COLORS = [
  "Đen",
  "Trắng",
  "Bạc",
  "Đỏ",
  "Xanh dương",
  "Xanh lá",
  "Ghi",
  "Vàng cát",
];
const PROVINCES = [
  "TP.HCM",
  "Hà Nội",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Hải Phòng",
];
const DISTRICTS = [
  "Quận 1",
  "Quận 3",
  "Quận 7",
  "Quận 9",
  "Cầu Giấy",
  "Thanh Xuân",
  "Sơn Trà",
];
const WARDS = ["Phường A", "Phường B", "Phường C", "Phường D"];
const SELLERS = [
  { name: "Nguyễn Văn A", phone: "0987654321", email: "a@reev.com" },
  { name: "Trần Thị B", phone: "0912345678", email: "b@reev.com" },
  { name: "Lê Văn C", phone: "0932456789", email: "c@reev.com" },
  { name: "Phạm Thị D", phone: "0934567890", email: "d@reev.com" },
  { name: "Hoàng Văn E", phone: "0945678901", email: "e@reev.com" },
  { name: "Vũ Thị F", phone: "0956789012", email: "f@reev.com" },
];

const VEHICLE_CATALOG = [
  // EV_CAR
  {
    category: "EV_CAR",
    brand: "VinFast",
    model: "VF e34",
    year: 2022,
    capacity: 42,
    range: 300,
  },
  {
    category: "EV_CAR",
    brand: "Tesla",
    model: "Model 3",
    year: 2021,
    capacity: 57,
    range: 430,
  },
  {
    category: "EV_CAR",
    brand: "Hyundai",
    model: "Kona EV",
    year: 2020,
    capacity: 39,
    range: 305,
  },

  // E_MOTORBIKE
  {
    category: "E_MOTORBIKE",
    brand: "VinFast",
    model: "Klara S",
    year: 2021,
    capacity: 1.2,
    range: 120,
  },
  {
    category: "E_MOTORBIKE",
    brand: "YADEA",
    model: "G5",
    year: 2022,
    capacity: 1.5,
    range: 110,
  },
  {
    category: "E_MOTORBIKE",
    brand: "Honda",
    model: "EM1",
    year: 2023,
    capacity: 1.4,
    range: 100,
  },

  // E_BIKE
  {
    category: "E_BIKE",
    brand: "Giant",
    model: "Explore E+",
    year: 2020,
    capacity: 0.5,
    range: 80,
  },
  {
    category: "E_BIKE",
    brand: "Trek",
    model: "Allant+ 8",
    year: 2021,
    capacity: 0.6,
    range: 85,
  },
  {
    category: "E_BIKE",
    brand: "Asama",
    model: "City E",
    year: 2019,
    capacity: 0.36,
    range: 60,
  },
];

const BATTERY_CATALOG = [
  // chemistry: LFP / NMC; voltage: 48-400V tuỳ loại
  {
    brand: "VinFast",
    model: "VF Pack 1",
    capacity_kwh: 42.0,
    voltage: 350,
    chemistry: "NMC",
    weight_kg: 320,
    dimension: "1800x1400x150 mm",
  },
  {
    brand: "CATL",
    model: "LFP-51.2V-100Ah",
    capacity_kwh: 5.12,
    voltage: 51.2,
    chemistry: "LFP",
    weight_kg: 42,
    dimension: "480x450x220 mm",
  },
  {
    brand: "Panasonic",
    model: "21700 pack",
    capacity_kwh: 3.6,
    voltage: 48,
    chemistry: "NMC",
    weight_kg: 18,
    dimension: "420x300x200 mm",
  },
  {
    brand: "Samsung",
    model: "SDI NCA",
    capacity_kwh: 7.0,
    voltage: 72,
    chemistry: "NCA",
    weight_kg: 24,
    dimension: "500x320x220 mm",
  },
  {
    brand: "BYD",
    model: "Blade pack",
    capacity_kwh: 55.0,
    voltage: 380,
    chemistry: "LFP",
    weight_kg: 320,
    dimension: "1700x1300x140 mm",
  },
];

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rnd(0, arr.length - 1)];

function moneyVN(min, max) {
  const step = 5_000_000;
  const raw = rnd(min / step, max / step) * step;
  return raw;
}

function genPicsumImages(seedBase, min = 1, max = 10) {
  const count = rnd(min, max);
  const out = [];
  for (let i = 0; i < count; i++) {
    const seed = `${seedBase}-${i + 1}`;
    // 1024x640 đủ nét cho preview/zoom
    out.push(`https://picsum.photos/seed/${encodeURIComponent(seed)}/1024/640`);
  }
  return out;
}

/** Lịch sử trạng thái trong bộ nhớ */
const HISTORY = new Map();

/** Bộ dữ liệu chính trong bộ nhớ */
let LISTINGS = [];

function pushHistory(id, fromStatus, toStatus, by = "Admin User", note = "") {
  const now = new Date();
  const item = {
    id: `${id}-${now.getTime()}`,
    listingId: id,
    from: fromStatus,
    to: toStatus,
    by,
    note,
    at: now.toISOString(),
  };
  if (!HISTORY.has(id)) HISTORY.set(id, []);
  HISTORY.get(id).unshift(item);
}

function seedOnce() {
  if (LISTINGS.length) return;

  let autoId = 100001;

  // 1) Sinh dataset XE
  const vehicleCount = 20;
  for (let i = 0; i < vehicleCount; i++) {
    const info = pick(VEHICLE_CATALOG);
    const seller = pick(SELLERS);
    const color = pick(COLORS);
    const province = pick(PROVINCES);
    const district = pick(DISTRICTS);
    const ward = pick(WARDS);

    const id = autoId++;
    const status = pick(STATUSES);
    const year = info.year + rnd(-1, 1);
    const soh = rnd(70, 100);
    const mileage = rnd(1000, 60000);
    const price = moneyVN(300_000_000, 2_000_000_000); // 300tr-2tỷ

    const created = new Date();
    created.setDate(created.getDate() - rnd(0, 180));

    LISTINGS.push({
      // ---- core listing
      id,
      code: `#${id}`,
      category: info.category, // EV_CAR/E_MOTORBIKE/E_BIKE
      title: `${info.brand} ${info.model} ${CATEGORY_LABEL[info.category]}`,
      sellerName: seller.name,
      sellerPhone: seller.phone,
      sellerEmail: seller.email,

      brand: info.brand,
      model: info.model,
      year,
      battery_capacity_kwh: info.capacity,
      soh_percent: soh,
      mileage_km: mileage,
      color,
      description:
        `Xe ${info.brand} ${info.model} ${year}. Màu ${color}. ` +
        `Quãng đường ${mileage.toLocaleString("vi-VN")} km. Pin danh định ${
          info.capacity
        } kWh, tầm hoạt động công bố ${info.range} km.`,

      // giá
      price,
      ai_suggested_price: Math.round(price * (0.95 + Math.random() * 0.1)),

      // nhãn & cờ
      verified: Math.random() < 0.45, // đã thẩm định
      is_consigned: Math.random() < 0.4, // ký gửi
      status,

      // địa lý
      province,
      district,
      ward,
      address: `${rnd(1, 200)} ${ward}, ${district}, ${province}`,

      // media
      images: genPicsumImages(`listing-${id}`),

      // thời gian
      created_at: created.toISOString(),
      updated_at: created.toISOString(),
    });

    // history khởi tạo
    pushHistory(id, "PENDING", status, "System", "Khởi tạo dữ liệu mẫu");
  }

  // 2) Sinh dataset PIN
  const batteryCount = 10;
  for (let i = 0; i < batteryCount; i++) {
    const info = pick(BATTERY_CATALOG);
    const seller = pick(SELLERS);
    const province = pick(PROVINCES);
    const district = pick(DISTRICTS);
    const ward = pick(WARDS);

    const id = autoId++;
    const status = pick(STATUSES);
    const soh = rnd(70, 99);
    const price = moneyVN(8_000_000, 120_000_000); // 8tr - 120tr

    const created = new Date();
    created.setDate(created.getDate() - rnd(0, 180));

    const comp = pick(
      VEHICLE_CATALOG.filter(
        (v) => v.category === "EV_CAR" || v.category === "E_MOTORBIKE"
      )
    );

    LISTINGS.push({
      id,
      code: `#${id}`,
      category: "BATTERY",
      title: `Pack pin ${info.brand} ${info.model} ${info.chemistry}`,
      sellerName: seller.name,
      sellerPhone: seller.phone,
      sellerEmail: seller.email,

      brand: info.brand,
      model: info.model,
      year: null,
      battery_capacity_kwh: info.capacity_kwh,
      soh_percent: soh,
      mileage_km: null,
      color: null,
      description:
        `Pack pin ${info.brand} ${info.model} hoá học ${info.chemistry}, ` +
        `dung lượng ${info.capacity_kwh} kWh, điện áp ${info.voltage}V, nặng ${info.weight_kg} kg, kích thước ${info.dimension}. ` +
        `Khuyến nghị tương thích: ${comp.brand} ${comp.model}.`,

      // giá
      price,
      ai_suggested_price: Math.round(price * (0.95 + Math.random() * 0.1)),

      verified: Math.random() < 0.55,
      is_consigned: Math.random() < 0.3,
      status,

      province,
      district,
      ward,
      address: `${rnd(1, 200)} ${ward}, ${district}, ${province}`,

      images: genPicsumImages(`listing-${id}`),

      created_at: created.toISOString(),
      updated_at: created.toISOString(),
    });

    pushHistory(id, "PENDING", status, "System", "Khởi tạo dữ liệu mẫu (pin)");
  }
}

function filterByQuery(arr, q = {}) {
  let result = [...arr];

  if (q.q) {
    const kw = String(q.q).toLowerCase();
    result = result.filter(
      (it) =>
        it.title.toLowerCase().includes(kw) ||
        it.brand.toLowerCase().includes(kw) ||
        it.model.toLowerCase().includes(kw) ||
        String(it.code).toLowerCase().includes(kw)
    );
  }

  if (q.sellerPhone) {
    const kw = String(q.sellerPhone);
    result = result.filter((it) => it.sellerPhone.includes(kw));
  }

  if (q.status) {
    result = result.filter((it) => it.status === q.status);
  }

  if (q.category) {
    result = result.filter((it) => it.category === q.category);
  }

  if (typeof q.verified === "boolean") {
    result = result.filter((it) => it.verified === q.verified);
  }

  if (typeof q.isConsigned === "boolean") {
    result = result.filter((it) => it.is_consigned === q.isConsigned);
  }

  if (q.sohFrom != null) {
    const min = Number(q.sohFrom) || 0;
    result = result.filter((it) => (it.soh_percent ?? 0) >= min);
  }

  if (q.createdFrom) {
    const from = new Date(q.createdFrom).getTime();
    result = result.filter((it) => new Date(it.created_at).getTime() >= from);
  }
  if (q.createdTo) {
    const to = new Date(q.createdTo).getTime();
    result = result.filter((it) => new Date(it.created_at).getTime() <= to);
  }

  return result;
}

function buildStats(arr) {
  const keys = ["PENDING", "ACTIVE", "REJECTED", "SOLD", "ARCHIVED"];
  const stats = {};
  keys.forEach((k) => (stats[k] = 0));
  arr.forEach((it) => {
    if (stats[it.status] == null) stats[it.status] = 0;
    stats[it.status] += 1;
  });
  return stats;
}

/* ===========================
 * PUBLIC APIs (fake)
 * =========================== */

export async function fakeList(params = {}) {
  seedOnce();

  const page = Number(params.page || 1);
  const size = Number(params.size || 10);

  const filtered = filterByQuery(LISTINGS, params);
  const total = filtered.length;

  const start = (page - 1) * size;
  const items = filtered.slice(start, start + size);

  const stats = buildStats(LISTINGS);

  // giả lập trễ mạng
  await new Promise((r) => setTimeout(r, 200));
  return { items, total, stats };
}

export async function fakeGetOne(id) {
  seedOnce();
  const found = LISTINGS.find((x) => String(x.id) === String(id));
  await new Promise((r) => setTimeout(r, 150));
  if (!found) throw new Error("Listing not found");
  return found;
}

export async function fakeApprove(id, note = "Duyệt tin") {
  seedOnce();
  const idx = LISTINGS.findIndex((x) => String(x.id) === String(id));
  if (idx >= 0) {
    const from = LISTINGS[idx].status;
    LISTINGS[idx] = {
      ...LISTINGS[idx],
      status: "APPROVED",
      updated_at: new Date().toISOString(),
    };
    pushHistory(id, from, "APPROVED", "Admin User", note);
  }
  await new Promise((r) => setTimeout(r, 120));
  return { ok: true };
}

export async function fakeReject(id, note = "Từ chối tin") {
  seedOnce();
  const idx = LISTINGS.findIndex((x) => String(x.id) === String(id));
  if (idx >= 0) {
    const from = LISTINGS[idx].status;
    LISTINGS[idx] = {
      ...LISTINGS[idx],
      status: "REJECTED",
      updated_at: new Date().toISOString(),
    };
    pushHistory(id, from, "REJECTED", "Admin User", note);
  }
  await new Promise((r) => setTimeout(r, 120));
  return { ok: true };
}

export async function fakeArchive(id, note = "Lưu trữ tin") {
  seedOnce();
  const idx = LISTINGS.findIndex((x) => String(x.id) === String(id));
  if (idx >= 0) {
    const from = LISTINGS[idx].status;
    LISTINGS[idx] = {
      ...LISTINGS[idx],
      status: "ARCHIVED",
      updated_at: new Date().toISOString(),
    };
    pushHistory(id, from, "ARCHIVED", "Admin User", note);
  }
  await new Promise((r) => setTimeout(r, 120));
  return { ok: true };
}

/**
 * Lịch sử thay đổi trạng thái
 * - Nếu truyền id → trả về lịch sử của listing đó
 * - Nếu không truyền → trả về 50 record mới nhất (toàn bảng) để dùng cho “Lịch sử (chung)”
 */
export async function fakeHistory(id) {
  seedOnce();
  await new Promise((r) => setTimeout(r, 120));

  if (id) return (HISTORY.get(Number(id)) || []).slice(0, 50);

  // gộp tất cả rồi sort theo thời gian
  const all = [];
  HISTORY.forEach((list) => all.push(...list));
  all.sort((a, b) => new Date(b.at) - new Date(a.at));
  return all.slice(0, 50);
}

/* alias (tùy chỗ dùng) */
export const fakeDetail = fakeGetOne;
export const fakeHistoryByListing = fakeHistory;
