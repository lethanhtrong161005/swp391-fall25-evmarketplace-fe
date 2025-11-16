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

    colorPrimary: "#1B2A41",


    colorBgBase: "#FFFFFF",
    colorBgLayout: "#E9F2FF", 
    colorBgContainer: "#FFFFFF",
    colorTextBase: "#000000",


    motion: true,
    motionDurationFast: "120ms",
    motionDurationMid: "200ms",
    motionDurationSlow: "280ms",


    zIndexPopupBase: 2100,

    borderRadius: 8,
  },
  components: {
    Button: {
      primaryColor: "#FFFFFF",
      colorPrimaryHover: "#2d4a6b",
      colorPrimaryActive: "#15202e",
    },
    Layout: {
      bodyBg: "#E9F2FF", 
      headerBg: "#FFFFFF",
    },
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
