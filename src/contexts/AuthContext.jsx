import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import cookieUtils from "@utils/cookieUtils";
import { loginPhone} from "@services/authService";

function getRoleFromPayload(payload) {
    const raw =
        payload?.role ||
        payload?.roles?.[0] ||
        payload?.authorities?.[0] ||
        payload?.scope ||
        "";
    return String(raw).toLowerCase();
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const isLoggedIn = !!user;

    // hydrate khi F5
    useEffect(() => {
        const payload = cookieUtils.decodeJwt();
        if (payload) setUser({ ...payload, role: getRoleFromPayload(payload) });
    }, []);

    // nếu interceptor refresh thất bại sẽ phát event này
    useEffect(() => {
        const onAuthLogout = () => setUser(null);
        window.addEventListener("auth-logout", onAuthLogout);
        return () => window.removeEventListener("auth-logout", onAuthLogout);
    }, []);

    const login = useCallback(async (dto) => {
        const res = await loginPhone(dto); // service đã lưu token
        const payload = cookieUtils.decodeJwt();
        setUser(payload ? { ...payload, role: getRoleFromPayload(payload) } : null);
        return res;
    }, []);

    const logout = useCallback(async () => {
        try {
            cookieUtils.clearAuth();
        } finally {
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
