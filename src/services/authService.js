
import api from "@utils/apiCaller";
import cookieUtils from "@utils/cookieUtils";
import { normalizeAuthError } from "@utils/authErrorMapper";



export const loginPhone = async (payload) => {
    const res = await api.post(
        "/api/auth/login-with-phone-number",
        payload,
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

    const { viMessage, viFieldErrors } = normalizeAuthError({
        status: data?.status,
        message: data?.message,
        fieldErrors: data?.fieldErrors,
    });

    const err = new Error(viMessage || "Đăng nhập thất bại");
    err.status = data?.status;
    err.fieldErrors = viFieldErrors;
    throw err;

}