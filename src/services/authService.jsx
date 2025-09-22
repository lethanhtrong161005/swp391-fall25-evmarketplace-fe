
import api from "@utils/apiCaller";

//Demo
export const login = async (data) => {
    const response = await api.post("/api/auth/login-with-phone-number", data, {
        validateStatus: () => true 
    });
    return response.data;
};