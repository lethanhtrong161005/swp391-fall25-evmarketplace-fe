import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntApp, message } from "antd";
import "@styles/styles.scss";
import App from "./App.jsx";
import { AuthProvider } from "@contexts/AuthContext.jsx";
import { FavoritesProvider } from "@contexts/FavoritesContext.jsx";
import { NotificationProvider } from "@contexts/NotificationContext.jsx";
import NotificationToast from "@components/Notification/Toast/NotificationToast";

message.config({
  duration: 3, // hiển thị 3 giây (sweet spot)
  maxCount: 3, // tối đa 3 toast cùng lúc
});

const theme = {
  token: {
    motion: true,
    motionDurationFast: "120ms",
    motionDurationMid: "200ms",
    motionDurationSlow: "280ms",
    zIndexPopupBase: 2100,
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <FavoritesProvider>
              <NotificationProvider>
                <App />
                <NotificationToast />
              </NotificationProvider>
            </FavoritesProvider>
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </StrictMode>
);
