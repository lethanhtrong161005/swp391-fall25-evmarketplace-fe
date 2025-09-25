import api from "@utils/apiCaller";
import { normalizeAuthError } from "@utils/authErrorMapper";

//RequestOTP
export const requestOtp = async ({phoneNumber, type}) => {
    
    const res = await api.post(
        "/api/accounts/request-otp",
        { phoneNumber, type },
        { validateStatus: () => true }
    );

    // Ưu tiên HTTP status cho thành công thay vì phụ thuộc vào data.status/data.success
    if (res?.status >= 200 && res?.status < 300) {
        return res.data;
    }

    const data = res?.data || {};
    const { viMessage, viFieldErrors } = normalizeAuthError({
        status: data?.status ?? res?.status,
        message: data?.message,
        fieldErrors: data?.fieldErrors,
    });

    const error = new Error(viMessage);
    error.status = data?.status ?? res?.status;
    error.fieldErrors = viFieldErrors || { phoneNumber: ["Số điện thoại không hợp lệ!"] };
    throw error;
};

//Verify OTP
export const verifyOtp = async({phoneNumber, otp}) => {
    const res = await api.post(
        "/api/accounts/verify-otp",
        {phoneNumber, otp},
        {validateStatus: () => true}
    )

    const data = res.data;
    if (res?.status >= 200 && res?.status < 300) 
        return res.data.data.tempToken;


    const { viMessage, viFieldErrors } = normalizeAuthError(
        {
            status: data?.status ?? res?.status,
            message: data?.message,
            fieldErrors: data?.fieldErrors
        }
    );

    const error = new Error(viMessage || "Xác thực OTP thất bại");
    error.status = data?.status ?? res?.status;
    error.fieldErrors = viFieldErrors

    throw error;
}
