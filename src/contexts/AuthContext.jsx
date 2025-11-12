import React, { useCallback, useEffect, useState } from "react";
import cookieUtils from "@utils/cookieUtils";
import { loginPhone } from "@services/authService";
import { AuthContext } from "./AuthContext.js";

function getRoleFromPayload(payload) {
  let raw =
    payload?.role ||
    payload?.roles?.[0] ||
    payload?.authorities?.[0] ||
    payload?.scope ||
    "";
  // return String(raw).toLowerCase();
  if (raw && typeof raw === "object") {
    // If it's an array-like object, pick first element
    if (Array.isArray(raw) && raw.length > 0) raw = raw[0];

    // Common fields that may contain the role string
    const candidates = ["name", "role", "authority", "code", "id", "value"];
    for (const key of candidates) {
      if (raw[key]) {
        raw = raw[key];
        break;
      }
    }

    if (raw && typeof raw === "object") raw = String(raw);
  }

  let roleStr = String(raw || "").toLowerCase();
  roleStr = roleStr.replace(/^role[_-]?/i, "");
  return roleStr;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;

  // hydrate khi F5
  useEffect(() => {
    const payload = cookieUtils.decodeJwt();
    if (payload) {
      setUser({ ...payload, role: getRoleFromPayload(payload) });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // nếu interceptor refresh thất bại sẽ phát event này
  useEffect(() => {
    const onAuthLogout = () => setUser(null);
    window.addEventListener("auth-logout", onAuthLogout);
    return () => window.removeEventListener("auth-logout", onAuthLogout);
  }, []);

  const login = useCallback(async (dto) => {
    let access = dto.accessToken;
    let refresh = dto.refreshToken;

    if (!access) {
      const res = await loginPhone(dto);
      access = res?.data?.accessToken;
      refresh = res?.data?.refreshToken;
    }

    if (access) {
      cookieUtils.setToken(access, refresh);

      const payload = cookieUtils.decodeJwt(access);

      const role = getRoleFromPayload(payload);

      const newUser = payload ? { ...payload, role } : null;

      setUser(newUser);

      return { user: newUser, role };
    }

    return null;
  }, []);

  const logout = useCallback(async () => {
    try {
      cookieUtils.clearAuth();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUserFromCookie = useCallback(() => {
    const payload = cookieUtils.decodeJwt();
    setUser(payload ? { ...payload, role: getRoleFromPayload(payload) } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        refreshUserFromCookie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
