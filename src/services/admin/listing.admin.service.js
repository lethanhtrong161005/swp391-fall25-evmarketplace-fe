// src/services/admin/listing.admin.service.js
// Khi BE sẵn: bật request() và tắt FAKE_MODE.
// import request from "@utils/apiCaller";

/* ===========================
 * Fake fallback (giữ nguyên như bạn đang dùng)
 * =========================== */
import {
  fakeList,
  fakeGetOne,
  fakeApprove,
  fakeReject,
  fakeArchive,
  fakeHistory,
} from "@/data/admin/manageListing.fake";

/** Toggle fake / real API (sau này có thể đọc từ import.meta.env.VITE_API_FAKE) */
const FAKE_MODE = true;

/* ===========================
 * Helpers
 * =========================== */

/**
 * Chuẩn hóa query FE -> query BE (snake_case, đổi tên field…)
 * FE truyền trong ManageListingPage: {
 *   q, sellerPhone, status, category, sohFrom, verified, isConsigned,
 *   createdFrom, createdTo, page, size
 * }
 */
function buildQuery(params = {}) {
  const {
    q,
    sellerPhone,
    status,
    category,
    sohFrom,
    verified,
    isConsigned,
    createdFrom,
    createdTo,
    page = 1,
    size = 10,
  } = params;

  const query = {
    q,
    seller_phone: sellerPhone,
    status,
    category,
    soh_from: sohFrom,
    verified,
    consigned: isConsigned,
    created_from: createdFrom,
    created_to: createdTo,
    page,
    size,
  };

  // loại undefined/null để query sạch
  Object.keys(query).forEach((k) => {
    if (query[k] === undefined || query[k] === null || query[k] === "") {
      delete query[k];
    }
  });

  return query;
}

/**
 * Hủy request an toàn với AbortController (khuyên dùng trong React effect).
 * Tham khảo: MDN – AbortController cho fetch. :contentReference[oaicite:0]{index=0}
 */
export function createAbortOptions(controller) {
  return controller ? { signal: controller.signal } : {};
}

/* ===========================
 * Listing APIs
 * =========================== */

/**
 * Danh sách bài đăng (10/ trang mặc định)
 * @param {Object} params - bộ lọc từ FilterBar
 * @param {AbortController} [controller] - truyền vào để hủy request khi unmount
 */
export async function listAdminListings(params = {}, controller) {
  if (FAKE_MODE) return fakeList(params);

  const query = buildQuery(params);
  // return request("get", "/api/admin/listings", { params: query, ...createAbortOptions(controller) });
  throw new Error("TODO: hook real API");
}

/**
 * Chi tiết bài đăng
 */
export async function getListingDetail(id, controller) {
  if (FAKE_MODE) return fakeGetOne(id);

  // return request("get", `/api/admin/listings/${id}`, createAbortOptions(controller));
  throw new Error("TODO: hook real API");
}

/**
 * Cập nhật trạng thái theo action (gom 3 nút lại 1 hàm)
 * BE có thể chọn:
 *  - PUT /admin/listings/:id/status  (body: { action, note })
 *  - HOẶC POST /admin/listings/:id/actions (approve/reject/archive)
 * Cả hai đều là mẫu được khuyến nghị trong thực tế khi cần thao tác ngoài CRUD thuần. :contentReference[oaicite:1]{index=1}
 */
async function updateListingStatus(id, action, note, controller) {
  if (FAKE_MODE) {
    if (action === "APPROVE") return fakeApprove(id);
    if (action === "REJECT") return fakeReject(id);
    if (action === "ARCHIVE") return fakeArchive(id);
    return Promise.resolve();
  }

  // Ví dụ nếu chọn PUT /status
  // return request("put", `/api/admin/listings/${id}/status`, { action, note }, createAbortOptions(controller));

  // Hoặc nếu chọn POST /actions
  // return request("post", `/api/admin/listings/${id}/actions`, { action, note }, createAbortOptions(controller));

  throw new Error("TODO: hook real API");
}

/** Duyệt (PENDING → APPROVED/ACTIVE) */
export async function approveListing(id, note, controller) {
  return updateListingStatus(id, "APPROVE", note, controller);
}

/** Từ chối (PENDING → REJECTED) */
export async function rejectListing(id, note, controller) {
  return updateListingStatus(id, "REJECT", note, controller);
}

/** Lưu trữ (ACTIVE → ARCHIVED) */
export async function archiveListing(id, note, controller) {
  return updateListingStatus(id, "ARCHIVE", note, controller);
}

/**
 * Lịch sử trạng thái
 */
export async function getListingHistory(id, controller) {
  if (FAKE_MODE) return fakeHistory(id);

  // return request("get", `/api/admin/listings/${id}/status-history`, createAbortOptions(controller));
  throw new Error("TODO: hook real API");
}
