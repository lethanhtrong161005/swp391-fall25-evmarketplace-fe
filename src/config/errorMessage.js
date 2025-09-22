export const ERROR_CODE = {
    // AUTH
    ACCOUNT_PHONE_NOT_VERIFIED: "ACCOUNT_PHONE_NOT_VERIFIED",
    ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
}

export const ERROR_MESSAGES = {
    'ACCOUNT_PHONE_NOT_VERIFIED': 'Tài khoản chưa xác thực số điện thoại',
    'ACCOUNT_NOT_FOUND': 'Tài khoản không tồn tại',
}

/**
 * @param {string} errorCode
 * @param {string} defaultMessage
 * @returns {string}
 */

export const getErrorMessage = (errorCode, defaultMessage = 'Đã xảy ra lỗi không xác định') => {
    return ERROR_MESSAGES[errorCode] || defaultMessage;
}

/**
 * @param {string} errorCode
 * @returns {boolean}
 */

export const isValidErrorCode = (errorCode) => {
    return Object.prototype.hasOwnProperty.call(ERROR_MESSAGES, errorCode);
}

export default {
    ERROR_CODE,
    ERROR_MESSAGES,
    getErrorMessage,
    isValidErrorCode
}