import api, { get, put, post } from '@utils/apiCaller';

// Get user profile
export const getUserProfile = async () => {
    // Use axios instance directly to force sending cookies
    const res = await api.get("/api/accounts/current", {
        withCredentials: true,
        validateStatus: () => true,
    });
    return res.data;
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
    try { formData.append("avatar", avatarFile); } catch (_) { /* no-op */ }

    // Try PUT first
    let res = await api.put("/api/accounts/update-avatar", formData, {
        withCredentials: true,
        validateStatus: () => true,
        headers: { "Content-Type": "multipart/form-data" },
    });

    // Return status + data to allow UI to handle errors precisely
    const payload = res?.data;
    if (payload && typeof payload === 'object') {
        return { status: res?.status, ...payload };
    }
    return { status: res?.status, data: payload };
};

export const requestPhoneOpt = async (phoneNumber) => {
    const res = await api.post("/api/accounts/request-otp", { phoneNumber }, {
        withCredentials: true,
        validateStatus: () => true,
    });
    return res.data;
}

export const verifyPhoneOtp = async ({ phoneNumber, otp }) => {
    const res = await api.post("/api/accounts/verify-otp", { phoneNumber, otp }, {
        withCredentials: true,
        validateStatus: () => true,
    });
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
    if (res?.status >= 200 && res?.status < 300)
        return res.data?.data;

    const { viMessage, viFieldErrors } = normalizeAuthError(
        {
            status: data?.status ?? res?.status,
            message: data?.message,
            fieldErrors: data?.fieldErrors
        }
    );

    const error = new Error(viMessage);
    error.status = data?.status ?? res?.status;
    error.fieldErrors = viFieldErrors

    throw error;
}

//Reset Password
export const resetPassword = async ({ token, newPassword }) => {
    const res = await api.post(
        "/api/accounts/reset-password",
        { token, newPassword },
        { validateStatus: () => true }
    )
    const data = res.data;
    if (res?.status >= 200 && res?.status < 300)
        return res.data;

    const { viMessage, viFieldErrors } = normalizeAuthError(
        {
            status: data?.status ?? res?.status,
            message: data?.message,
            fieldErrors: data?.fieldErrors
        }
    );

    const error = new Error(viMessage);
    error.status = data?.status ?? res?.status;
    error.fieldErrors = viFieldErrors

    throw error;
}