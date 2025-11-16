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

api.interceptors.request.use((req) => {
  const token = cookieUtils.getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (req.data instanceof FormData) {
    delete req.headers["Content-Type"];
  } else {
    req.headers["Content-Type"] = "application/json";
  }
  return req;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const request = async (
  method,
  endpoint,
  { params = {}, body = {}, headers = {} } = {}
) => {
  try {
    const res = await api({
      url: endpoint,
      method,
      params,
      data: body,
      headers,
    });
    if (!res) {
      console.warn("[apiCaller] Response is null for:", endpoint);
      return null;
    }
    return res.data;
  } catch (err) {
    console.error("[apiCaller] Request error for:", endpoint, err);
    if (err.response) {
      throw err.response.data || { success: false, message: err.message };
    }
    throw { success: false, message: err.message || "Network error" };
  }
};

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
