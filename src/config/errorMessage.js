export const ERROR_CODE = {
    // AUTH / PROFILE (example)
    ACCOUNT_PHONE_NOT_VERIFIED: "ACCOUNT_PHONE_NOT_VERIFIED",
    ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
    PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",

    // NETWORK / AXIOS
    NETWORK_ERROR: "NETWORK_ERROR",
    ERR_CONNECTION_REFUSED: "ERR_CONNECTION_REFUSED",
    ERR_TIMEOUT: "ERR_TIMEOUT",
    ERR_CANCELED: "ERR_CANCELED",

    // HTTP STATUS
    HTTP_400: "HTTP_400",
    HTTP_401: "HTTP_401",
    HTTP_403: "HTTP_403",
    HTTP_404: "HTTP_404",
    HTTP_500: "HTTP_500",

    // fallback
    UNKNOWN_ERROR: "UNKNOWN_ERROR"
};

export const ERROR_MESSAGES = {
    // Auth / profile
    ACCOUNT_PHONE_NOT_VERIFIED: "Tài khoản chưa xác thực số điện thoại",
    ACCOUNT_NOT_FOUND: "Tài khoản không tồn tại",
    PROFILE_NOT_FOUND: "Không tìm thấy thông tin profile",

    // Network / axios
    NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng kiểm tra Internet",
    ERR_CONNECTION_REFUSED: "Không thể kết nối tới server. Vui lòng thử lại sau",
    ERR_TIMEOUT: "Kết nối tới server quá lâu. Vui lòng thử lại",
    ERR_CANCELED: "Yêu cầu đã bị hủy",

    // HTTP status
    HTTP_400: "Yêu cầu không hợp lệ (400)",
    HTTP_401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại (401)",
    HTTP_403: "Bạn không có quyền truy cập (403)",
    HTTP_404: "Không tìm thấy tài nguyên (404)",
    HTTP_500: "Lỗi server nội bộ (500)",

    // fallback
    UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định"
};

export const getErrorMessage = (errorCode, defaultMessage = "Đã xảy ra lỗi không xác định") => {
    if (!errorCode) return defaultMessage;
    return ERROR_MESSAGES[errorCode] || defaultMessage;
};

export const isValidErrorCode = (errorCode) => {
    return Object.prototype.hasOwnProperty.call(ERROR_MESSAGES, errorCode);
};

/**
 * Map axios/backend error -> Vietnamese message
 * - Backend: places business error code string in response.data.message
 * - Axios network errors: error.code (e.g. ERR_CONNECTION_REFUSED)
 * - HTTP status: error.response.status -> HTTP_{status}
 */
export const getAxiosErrorMessage = (error) => {
    // 1) Backend business code in response.data.message (preferred)
    const backendMsg = error?.response?.data?.message;
    if (backendMsg) {
        return isValidErrorCode(backendMsg) ? getErrorMessage(backendMsg) : String(backendMsg);
    }

    // 2) HTTP status -> map to HTTP_{status}
    const status = error?.response?.status;
    if (status) {
        const key = `HTTP_${status}`;
        if (isValidErrorCode(key)) return getErrorMessage(key);
        return `Lỗi HTTP ${status}`;
    }

    // 3) Axios network/code (ERR_CONNECTION_REFUSED, ERR_TIMEOUT, ...)
    if (error?.code) {
        return isValidErrorCode(error.code) ? getErrorMessage(error.code) : getErrorMessage("NETWORK_ERROR");
    }

    // 4) Fallback to message or UNKNOWN_ERROR
    if (error?.message) return String(error.message);
    return getErrorMessage("UNKNOWN_ERROR");
};

export default {
    ERROR_CODE,
    ERROR_MESSAGES,
    getErrorMessage,
    isValidErrorCode,
    getAxiosErrorMessage
};