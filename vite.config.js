import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8089",
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket for /api if needed
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // Log proxy errors but don't crash
            console.log("[proxy error]", err.message);
          });
          proxy.on("proxyReqWs", (proxyReq, _req, _socket) => {
            // Handle WebSocket proxy requests
            proxyReq.on("error", (err) => {
              // Ignore WebSocket connection errors (common when server restarts)
              if (err.code !== "ECONNRESET") {
                console.log("[ws proxy error]", err.message);
              }
            });
          });
        },
      },
      "/ws": {
        target: "ws://localhost:8089",
        ws: true,
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // Log proxy errors but don't crash
            if (err.code !== "ECONNRESET") {
              console.log("[ws proxy error]", err.message);
            }
          });
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["fsevents"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // alias @ => src
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@validators": path.resolve(__dirname, "./src/validators"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@dtos": path.resolve(__dirname, "./src/dtos"),
      "@mappers": path.resolve(__dirname, "./src/mappers"),
    },
  },
});
