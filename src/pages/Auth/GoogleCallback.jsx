import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, message, Button, Space } from "antd";
import { exchangeGoogleCode } from "@services/authService";
import { useAuth } from "@hooks/useAuth";
import { getDashboardPath } from "@config/roles";

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

        // Lấy thông tin user từ cookie để xác định role
        const cookieUtils = await import("@utils/cookieUtils");
        const payload = cookieUtils.default.decodeJwt();
        const role =
          payload?.role ||
          payload?.roles?.[0] ||
          payload?.authorities?.[0] ||
          payload?.scope ||
          "";
        const normalizedRole = String(role).toLowerCase();

        // Redirect về dashboard tương ứng với role của user
        const dashboardPath = getDashboardPath(normalizedRole);
        if (dashboardPath) {
          navigate(dashboardPath, { replace: true });
        } else {
          // Nếu không có dashboard (member), về trang chủ
          navigate("/", { replace: true });
        }
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
