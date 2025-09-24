import { getErrorMessage, isValidErrorCode } from "@config/errorMessage";

function toViMessage(enMsg, fallback = "Đăng nhập thất bại") {
    if (!enMsg) return fallback;
    if (isValidErrorCode?.(enMsg)) return getErrorMessage(enMsg, fallback);

    const exact = {
        "Validation failed": "Dữ liệu không hợp lệ",
        "Wrong password": "Mật khẩu không đúng",
        "Invalid credentials": "Số điện thoại hoặc mật khẩu không đúng",
        "Unauthorized": "Chưa đăng nhập hoặc phiên đã hết hạn",
        "Forbidden": "Bạn không có quyền thực hiện thao tác này",
        "Phone number not found": "Không tìm thấy số điện thoại",
        "Phone number already exists": "Số điện thoại đã tồn tại",
        "Invalid OTP": "Mã OTP không hợp lệ",
        "OTP has expired": "Mã OTP đã hết hạn",
        "OTP is already used": "Mã OTP đã được sử dụng",
        "Token has expired": "Vui lòng thử lại"
    }[enMsg];
    if (exact) return exact;

    const REGEX = [
        [/(request )?method '.+' is not supported/i, "Phương thức HTTP không được hỗ trợ"],
        [/invalid (phone|phone number)/i, "Số điện thoại không hợp lệ"],
        [/bad credentials/i, "Số điện thoại hoặc mật khẩu không đúng"],
    ];
    for (const [re, vi] of REGEX) if (re.test(enMsg)) return vi;
    return fallback;
}

function translateFieldErrors(fieldErrors = {}) {
    if (!fieldErrors) return null;
    const MAP = {
        phoneNumber: {
            "Invalid phone number format": "Số điện thoại không hợp lệ !",
            "Phone number is required": "Vui lòng nhập số điện thoại !",
            "Phone number not found": "Không tìm thấy số điện thoại !",
        },
        password: {
            "Password is required": "Vui lòng nhập mật khẩu !",
            "Wrong password": "Mật khẩu không đúng !",
            "Invalid password": "Mật khẩu không đúng !",
        },
        otp: {
            "OTP is required": "Vui lòng nhập mã OTP",
            "OTP must be exactly 6 digits": "OTP bắt buộc 6 số"
        }
    };
    const DEFAULT = { phoneNumber: "Số điện thoại không hợp lệ !", password: "Mật khẩu không hợp lệ !" };

    const result = {};
    for (const [field, messages] of Object.entries(fieldErrors)) {
        const arr = Array.isArray(messages) ? messages : [String(messages)];
        result[field] = arr.map((m) => MAP[field]?.[m] || DEFAULT[field] || "Giá trị không hợp lệ");
    }
    return result;
}

export function normalizeAuthError(beError) {
    let viMessage = toViMessage(beError?.message);
    let viFieldErrors = translateFieldErrors(beError?.fieldErrors || {});

    // Fallback: BE không trả fieldErrors nhưng message cho biết nguyên nhân
    if (!viFieldErrors || Object.keys(viFieldErrors).length === 0) {
        if (/wrong password/i.test(beError?.message || "")) {
            viFieldErrors = { password: ["Mật khẩu không đúng !"] };
        } else if (/phone number not found/i.test(beError?.message || "")) {
            viFieldErrors = { phoneNumber: ["Không tìm thấy số điện thoại !"] };
        }
    }
    return { viMessage, viFieldErrors };
}
