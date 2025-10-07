import api from "@utils/apiCaller";
import cookieUtils from "@utils/cookieUtils";

import config from "@config";
import { normalizeAuthError } from "@utils/authErrorMapper";

//Login With Phone Number
export const loginPhone = async (payload) => {
  const res = await api.post("/api/auth/login-with-phone-number", payload, {
    validateStatus: () => true,
  });

  const data = res.data;

  if (data?.status === 200 && data?.success) {
    const access = data?.data?.accessToken || "";
    const refresh = data?.data?.refreshToken || "";

    cookieUtils.setToken(access);
    if (refresh) cookieUtils.setRefreshToken(refresh);

    return data;
  }

  const { viMessage, viFieldErrors } = normalizeAuthError({
    status: data?.status,
    message: data?.message,
    fieldErrors: data?.fieldErrors,
  });

  const err = new Error(viMessage || "Đăng nhập thất bại");
  err.status = data?.status;
  err.fieldErrors = viFieldErrors;
  throw err;
};

//Login google

// Lấy auth URL từ BE
export const getGoogleAuthUrl = async () => {
  const res = await api.get(
    config.publicRuntime.OAUTH_GOOGLE_INIT || "/api/auth/google",
    { validateStatus: () => true }
  );
  const data = res.data;
  if (data?.status === 200 && data?.success && typeof data?.data === "string") {
    return data.data; // chính là URL Google
  }
  throw new Error(data?.message || "Không lấy được Google auth URL");
};

// ----- Đổi code lấy token (mới) -----
export const exchangeGoogleCode = async (code) => {
  // endpoint BE đổi code -> token (theo mô tả của bạn)
  // ví dụ: POST /api/google/callback { code }
  const res = await api.post(
    "/api/auth/google/callback",
    { code },
    { validateStatus: () => true }
  );
  const data = res.data;

  if (data?.status === 200 && data?.success) {
    const access = data?.data?.accessToken || "";
    const refresh = data?.data?.refreshToken || "";
    cookieUtils.setToken(access);
    if (refresh) cookieUtils.setRefreshToken(refresh);
    return data;
  }

  const err = new Error(data?.message || "Đăng nhập Google thất bại");
  err.status = data?.status;
  err.fieldErrors = data?.fieldErrors;
  throw err;
};

//End login google
