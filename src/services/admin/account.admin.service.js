import { get, post, patch } from "@utils/apiCaller";

// Lấy danh sách tài khoản với phân trang và sắp xếp
export const listAccounts = (params = {}) => {
  const { page = 0, size = 10, sort = "", dir = "desc" } = params;
  const queryParams = { page, size };
  if (sort && sort.trim()) {
    queryParams.sort = sort;
    queryParams.dir = dir;
  }
  return get("/api/admin/accounts/", queryParams);
};

// Lấy chi tiết một tài khoản theo ID
export const getAccountDetail = (id) => {
  return get(`/api/admin/accounts/${id}`);
};

// Tạo tài khoản mới từ trang Admin
export const createAccount = (payload) => {
  // Validation đầu vào
  if (!payload || typeof payload !== "object") {
    throw new Error("Dữ liệu không hợp lệ");
  }

  // Kiểm tra các trường bắt buộc
  if (!payload.phoneNumber || !payload.password || !payload.fullName) {
    throw new Error(
      "Thiếu thông tin bắt buộc: số điện thoại, mật khẩu, họ tên"
    );
  }

  // Validation chi tiết
  const phoneRegex = /^[0-9]{10,11}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,32}$/;
  const fullNameRegex = /^[\p{L}][\p{L}\s\-']{1,49}$/u;

  if (!phoneRegex.test(payload.phoneNumber)) {
    throw new Error("Số điện thoại không hợp lệ (10-11 số)");
  }

  if (!passwordRegex.test(payload.password)) {
    throw new Error(
      "Mật khẩu phải có 8-32 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    );
  }

  if (!fullNameRegex.test(payload.fullName)) {
    throw new Error(
      "Họ tên không hợp lệ (2-50 ký tự, chỉ chữ cái và khoảng trắng)"
    );
  }

  return post("/api/admin/accounts/register", payload);
};

// Cập nhật thông tin tài khoản (partial update)
export const updateAccount = (id, updateData) => {
  if (!id) {
    throw new Error("ID tài khoản là bắt buộc");
  }
  if (!updateData || typeof updateData !== "object") {
    throw new Error("Dữ liệu cập nhật là bắt buộc");
  }

  // Loại bỏ trường id khỏi updateData để tránh xung đột
  const { id: _, ...payload } = updateData;

  return patch(`/api/admin/accounts/${id}`, payload);
};

// Tìm kiếm tài khoản theo từ khóa
export const searchAccounts = (params = {}) => {
  const { keyword = "", page = 0, size = 10, sort = "", dir = "asc" } = params;
  const queryParams = { keyword, page, size };
  if (sort && sort.trim()) {
    queryParams.sort = sort;
    queryParams.dir = dir;
  }
  return get("/api/admin/accounts/searchAccount", queryParams);
};

// Khóa tài khoản
export const blockAccount = (id) => {
  return patch(`/api/admin/accounts/${id}/block`);
};

// Mở khóa tài khoản
export const unblockAccount = (id) => {
  return patch(`/api/admin/accounts/${id}/unblock`);
};

// Thay đổi vai trò tài khoản (chưa triển khai)
// eslint-disable-next-line no-unused-vars
export const changeRole = (id, role) => {
  return Promise.resolve();
};

// Alias cho khóa/mở khóa tài khoản
export const lockAccount = (id) => blockAccount(id);
export const unlockAccount = (id) => unblockAccount(id);

// Lấy lịch sử hoạt động tài khoản (chưa triển khai)
// eslint-disable-next-line no-unused-vars
export const getAccountLogs = (id) => {
  return Promise.resolve({ data: [] });
};
