import api from '@utils/apiCaller';
import { ERROR_CODE } from '@config/errorMessage';
import { normalizeAuthError } from "@utils/authErrorMapper";


// Get user profile
export const getUserProfile = async () => {
    const response = await api.get("/api/accounts/current", {}, {
        validateStatus: () => true
    });

    
    return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    const response = await api.put("/api/accounts/update-profile", profileData, {}, {
        validateStatus: () => true
    });
    return response.data;
};

// Create account
export const createAccount = async ({tempToken, fullName, password}) => {
    const res = await api.post(
        "/api/accounts/register",
        {tempToken, fullName, password},
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
