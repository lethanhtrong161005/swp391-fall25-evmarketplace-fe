import axios from "axios";
import cookieUtils from "./cookieUtils";
import config from "@config";

const api = axios.create({
  baseURL: config.publicRuntime.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Gắn token
api.interceptors.request.use((req) => {
  const token = cookieUtils.getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  // Nếu là FormData → gỡ Content-Type để browser tự set boundary
  if (req.data instanceof FormData) {
    // Axios có thể đã set từ nơi khác -> xóa chắc ăn
    delete req.headers["Content-Type"];
  } else {
    // Còn lại mặc định gửi JSON
    req.headers["Content-Type"] = "application/json";
  }
  return req;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm gọi API chung
const request = async (
  method,
  endpoint,
  { params = {}, body = {}, headers = {} } = {}
) => {
  // Log cho sort debug
  if (endpoint.includes("/api/listing") && params.sort) {
    console.log("🔴 [SORT DEBUG] apiCaller - Request:", {
      method,
      endpoint,
      params: JSON.stringify(params, null, 2),
      sortParam: params.sort,
      dirParam: params.dir,
    });

    // Tạo query string để xem params thực tế
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
    console.log("🔴 [SORT DEBUG] apiCaller - Query string:", queryString);
    console.log("🔴 [SORT DEBUG] apiCaller - Base URL:", api.defaults.baseURL);
  }

  try {
    const res = await api({
      url: endpoint,
      method,
      params,
      data: body,
      headers,
    });

    // Log response URL để xem URL thực tế được gọi
    if (endpoint.includes("/api/listing") && params.sort) {
      console.log(
        "🔴 [SORT DEBUG] apiCaller - Response config URL:",
        res.config?.url
      );
      console.log(
        "🔴 [SORT DEBUG] apiCaller - Response config params:",
        res.config?.params
      );
    }
    // Kiểm tra res không null trước khi truy cập .data
    if (!res) {
      console.warn("[apiCaller] Response is null for:", endpoint);
      return null;
    }
    return res.data;
  } catch (err) {
    console.error("[apiCaller] Request error for:", endpoint, err);
    // Return error in a consistent format
    if (err.response) {
      throw err.response.data || { success: false, message: err.message };
    }
    throw { success: false, message: err.message || "Network error" };
  }
};

// CRUD methods
export const get = (endpoint, params = {}, headers = {}) =>
  request("GET", endpoint, { params, headers });

export const post = (endpoint, body = {}, params = {}, headers = {}) =>
  request("POST", endpoint, { body, params, headers });

export const put = (endpoint, body = {}, params = {}, headers = {}) =>
  request("PUT", endpoint, { body, params, headers });

export const patch = (endpoint, body = {}, params = {}, headers = {}) =>
  request("PATCH", endpoint, { body, params, headers });

export const remove = (endpoint, params = {}, headers = {}) =>
  request("DELETE", endpoint, { params, headers });

export default api;
