import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, message, Button, Space } from "antd";
import { exchangeGoogleCode } from "@services/authService";
import { useAuth } from "@hooks/useAuth";

const GoogleCallback = () => {
  const { search, hash } = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  // Google có thể trả code ở search, đôi khi flow khác sẽ dính ở hash -> xử lý cả 2
  const qs =
    search || (hash?.includes("?") ? hash.slice(hash.indexOf("?")) : "");
  const params = new URLSearchParams(qs);
  const code = params.get("code");

  const navigate = useNavigate();
  const { refreshUserFromCookie } = useAuth();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    (async () => {
      if (!code) {
        messageApi.error("Thiếu mã xác thực từ Google", 1);
        await new Promise((r) => setTimeout(r, 800));
        navigate("/", { replace: true });
        return;
      }
      try {
        await exchangeGoogleCode(code);
        refreshUserFromCookie();
        messageApi.success("Đăng nhập Google thành công", 1.2);
        await new Promise((r) => setTimeout(r, 800));
        navigate("/", { replace: true });
      } catch (e) {
        messageApi.error(e?.message || "Đăng nhập Google thất bại", 1.2);
        await new Promise((r) => setTimeout(r, 1200));
        navigate("/", { replace: true });
      }
    })();
  }, [code, navigate, refreshUserFromCookie, messageApi]);

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: 240 }}>
      {contextHolder}
      <Spin />
    </div>
  );
};

export default GoogleCallback;
