import api from '@utils/apiCaller';
import { ERROR_CODE } from '@config/errorMessage';

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
    