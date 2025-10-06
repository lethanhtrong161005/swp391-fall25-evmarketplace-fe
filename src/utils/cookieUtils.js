import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import config from "../config";

const cookies = new Cookies(null, { path: "/" });

class CookieUtils {
  getItem(key, defaultValue = "") {
    return cookies.get(key) ?? defaultValue;
  }
  setItem(key, value = "") {
    cookies.set(key, value, { path: "/" });
  }
  removeItem(key) {
    cookies.remove(key, { path: "/" });
  }

  getToken() {
    return this.getItem(config.cookies.token);
  }
  setToken(value = "") {
    this.setItem(config.cookies.token, value);
  }

  getRefreshToken() {
    return this.getItem(config.cookies.refreshToken);
  }
  setRefreshToken(value = "") {
    this.setItem(config.cookies.refreshToken, value);
  }

  clearAuth() {
    this.removeItem(config.cookies.token);
    this.removeItem(config.cookies.refreshToken);
  }

  decodeJwt(token) {
    const t = token || this.getToken();
    if (!t) return undefined;
    try {
      const payload = jwtDecode(t);
      return payload;
    } catch (e) {
      this.clearAuth();
      console.error("Decode JWT error:", e);
      return undefined;
    }
  }
}

export default new CookieUtils();
