
import axios from "axios"
import cookieUtils from "./cookieUtils"
import config from "../config"


const api = axios.create({
    baseURL: config.publicRuntime.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

// Interceptor để tự động gắn token vào header
api.interceptors.request.use(
    (req) => {
        const token = cookieUtils.getToken();
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
    },
    (error) => Promise.reject(error)
);

// Hàm gọi API chung
const request = async (method, endpoint, { params = {}, body = {}, headers = {} } = {}) => {
    try {
        const res = await api({
            url: endpoint,
            method,
            params,
            data: body,
            headers,
        });
        return res.data;
    } catch (err) {
        throw err.response?.data || err;
    }
};

// CRUD methods
export const get = (endpoint, params = {}, headers = {}) =>
    request("GET", endpoint, { params, headers });

export const post = (endpoint, body = {}, params = {}, headers = {}) =>
    request("POST", endpoint, { body, params, headers });

export const put = (endpoint, body = {}, params = {}, headers = {}) =>
    request("PUT", endpoint, { body, params, headers });

export const remove = (endpoint, params = {}, headers = {}) =>
    request("DELETE", endpoint, { params, headers });

export default api;