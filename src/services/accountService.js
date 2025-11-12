import api from "@utils/apiCaller";
import { normalizeAuthError } from "@utils/authErrorMapper";

// ===== USER PROFILE APIs =====
// Get user profile
export const getUserProfile = async () => {
  try {
    const res = await api.get("/api/accounts/current", {
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
    return res.data; // giữ nguyên structure { success, data, message }
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    throw err;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const res = await api.put("/api/accounts/update-profile", profileData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  });
  return res.data;
};

export const updateUserAvatar = async (avatarFile) => {
  const formData = new FormData();
  // Most backends expect field name 'file' for MultipartFile
  formData.append("file", avatarFile);
  // Some backends use 'avatar' as the field name
  try {
    formData.append("avatar", avatarFile);
  } catch {
    /* no-op */
  }

  // Try PUT first
  let res = await api.put("/api/accounts/update-avatar", formData, {
    withCredentials: true,
    validateStatus: () => true,
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Return status + data to allow UI to handle errors precisely
  const payload = res?.data;
  if (payload && typeof payload === "object") {
    return { status: res?.status, ...payload };
  }
  return { status: res?.status, data: payload };
};

export const requestPhoneOpt = async (phoneNumber) => {
  const res = await api.post(
    "/api/accounts/request-otp",
    { phoneNumber },
    {
      withCredentials: true,
      validateStatus: () => true,
    }
  );
  return res.data;
};

export const verifyPhoneOtp = async ({ phoneNumber, otp }) => {
  const res = await api.post(
    "/api/accounts/verify-otp",
    { phoneNumber, otp },
    {
      withCredentials: true,
      validateStatus: () => true,
    }
  );
  return res.data;
};

// Create account
export const createAccount = async ({ tempToken, fullName, password }) => {
  const res = await api.post(
    "/api/accounts/register",
    { tempToken, fullName, password },
    { validateStatus: () => true }
  );
  const data = res.data;
  if (res?.status >= 200 && res?.status < 300) return res.data?.data;

  const { viMessage, viFieldErrors } = normalizeAuthError({
    status: data?.status ?? res?.status,
    message: data?.message,
    fieldErrors: data?.fieldErrors,
  });

  const error = new Error(viMessage);
  error.status = data?.status ?? res?.status;
  error.fieldErrors = viFieldErrors;

  throw error;
};

//Reset Password
export const resetPassword = async ({ token, newPassword }) => {
  const res = await api.post(
    "/api/accounts/reset-password",
    { token, newPassword },
    { validateStatus: () => true }
  );
  const data = res.data;
  if (res?.status >= 200 && res?.status < 300) return res.data;

  const { viMessage, viFieldErrors } = normalizeAuthError({
    status: data?.status ?? res?.status,
    message: data?.message,
    fieldErrors: data?.fieldErrors,
  });

  const error = new Error(viMessage);
  error.status = data?.status ?? res?.status;
  error.fieldErrors = viFieldErrors;

  throw error;
};

// ===== ADMIN ACCOUNT MANAGEMENT APIs =====

// Get all accounts with pagination and filtering
export const getAllAccounts = async (params = {}) => {
  const {
    page = 1,
    pageSize = 10,
    role = "",
    status = "",
    province = "",
    search = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(role && { role }),
    ...(status && { status }),
    ...(province && { province }),
    ...(search && { search }),
    sortBy,
    sortOrder,
  });

  const res = await api.get(`/api/admin/accounts?${queryParams}`, {
    withCredentials: true,
    validateStatus: () => true,
  });

  if (res?.status >= 200 && res?.status < 300) {
    return res.data;
  }

  throw new Error(res.data?.message || "Lỗi khi tải danh sách tài khoản");
};

// Get account by ID
export const getAccountById = async (accountId) => {
  const res = await api.get(`/api/admin/accounts/${accountId}`, {
    withCredentials: true,
    validateStatus: () => true,
  });

  if (res?.status >= 200 && res?.status < 300) {
    return res.data;
  }

  throw new Error(res.data?.message || "Lỗi khi tải thông tin tài khoản");
};

// Update account role
export const updateAccountRole = async (accountId, newRole) => {
  const res = await api.put(
    `/api/admin/accounts/${accountId}/role`,
    { role: newRole },
    {
      withCredentials: true,
      validateStatus: () => true,
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res?.status >= 200 && res?.status < 300) {
    return res.data;
  }

  throw new Error(res.data?.message || "Lỗi khi cập nhật vai trò tài khoản");
};

// Update account status (lock/unlock)
export const updateAccountStatus = async (accountId, newStatus) => {
  let endpoint = "";
  if (newStatus === "SUSPENDED") {
    endpoint = `/api/admin/accounts/${accountId}/block`;
  } else if (newStatus === "ACTIVE") {
    endpoint = `/api/admin/accounts/${accountId}/unblock`;
  } else {
    throw new Error("Trạng thái không hợp lệ");
  }
  const res = await api.patch(
    endpoint,
    {},
    {
      withCredentials: true,
      validateStatus: () => true,
      headers: { "Content-Type": "application/json" },
    }
  );
  if (res?.status >= 200 && res?.status < 300) {
    return res.data;
  }
  throw new Error(res.data?.message || "Lỗi khi cập nhật trạng thái tài khoản");
};

// Update account profile (admin)
export const updateAccountProfile = async (accountId, profileData) => {
  const res = await api.put(
    `/api/admin/accounts/${accountId}/profile`,
    profileData,
    {
      withCredentials: true,
      validateStatus: () => true,
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res?.status >= 200 && res?.status < 300) {
    return res.data;
  }

  throw new Error(res.data?.message || "Lỗi khi cập nhật thông tin tài khoản");
};

// Get account activity logs
export const getAccountActivityLogs = async (accountId, params = {}) => {
  const {
    page = 1,
    pageSize = 20,
    action = "",
    startDate = "",
    endDate = "",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(action && { action }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });

  const res = await api.get(
    `/api/admin/accounts/${accountId}/logs?${queryParams}`,
    {
      withCredentials: true,
      validateStatus: () => true,
    }
  );

  if (res?.status >= 200 && res?.status < 300) {
    return res.data;
  }

  throw new Error(res.data?.message || "Lỗi khi tải nhật ký hoạt động");
};

// Manager get account staff
export const getStaffOfBranch = async () => {
  const res = await api.get(`/api/manager/accounts/staff`);
  return res.data;
};


// ===== EMAIL UPDATE APIs =====

// Gửi OTP đến email mới
export const requestEmailOtp = async (email) => {
  try {
    const res = await api.post(
      "/api/accounts/email/request-otp",
      { email },
      {
        withCredentials: true,
        validateStatus: () => true,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res?.status >= 200 && res?.status < 300) {
      return res.data;
    }

    throw new Error(res.data?.message || "Không thể gửi mã OTP đến email.");
  } catch (err) {
    console.error("Error in requestEmailOtp:", err);
    throw err;
  }
};

// Cập nhật email sau khi xác thực OTP
export const updateEmailWithOtp = async ({ newEmail, otp }) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.put(
    `/api/accounts/update-email?newEmail=${encodeURIComponent(newEmail)}&otp=${encodeURIComponent(otp)}`,
    null, 
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true,
    }
  );

  if (res?.status >= 200 && res?.status < 300) {
    return res.data;
  }
  throw new Error(res.data?.message || "Không thể cập nhật email.");
};
