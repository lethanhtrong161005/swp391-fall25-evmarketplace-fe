
const publicRuntime = {

    APP_URL: window.location.origin,
    API_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8089",

    OAUTH_GOOGLE_INIT: "/api/auth/google",
    OAUTH_GOOGLE_EXCHANGE: "/api/auth/google/callback",
}

export default publicRuntime;
