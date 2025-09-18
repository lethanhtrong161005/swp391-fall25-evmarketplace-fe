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

    deleteUser() {
        this.removeItem(config.cookies.token);
    }

    decodeJwt() {
        const token = this.getToken();
        if (!token) return undefined;

        try {
            return jwtDecode(token);
        } catch (err) {
            this.deleteUser();
            return undefined;
        }
    }

    clear() {
        this.removeItem(config.cookies.token);
    }
}

export default new CookieUtils();