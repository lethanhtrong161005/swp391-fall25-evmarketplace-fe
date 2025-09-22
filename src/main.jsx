<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import '@styles/styles.scss'
import { AuthProvider } from "@contexts/AuthContext";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
=======
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntApp, message } from "antd";
import "@styles/styles.scss";
import App from "./App.jsx";
import { AuthProvider } from "@contexts/AuthContext";

message.config({
  duration: 3,     // hiển thị 3 giây (sweet spot)
  maxCount: 3,     // tối đa 3 toast cùng lúc
});

const theme = {
  token: {
    motion: true,
    motionDurationFast: "120ms",
    motionDurationMid:  "200ms",
    motionDurationSlow: "280ms",
    zIndexPopupBase: 2100,
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </StrictMode>
>>>>>>> main
)
