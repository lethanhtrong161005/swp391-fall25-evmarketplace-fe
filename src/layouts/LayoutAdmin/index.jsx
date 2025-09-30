import React, { useState } from "react";
import { Layout, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import SidebarBrand from "./_components/SidebarBrand";
import SidebarProfile from "./_components/SidebarProfile";
import SidebarMenu from "./_components/SidebarMenu";
import SidebarBottomActions from "./_components/SidebarBottomActions";
import NotificationDrawer from "./_components/NotificationDrawer";

const { Sider, Header, Content } = Layout;

export default function LayoutAdmin() {
  const [notiOpen, setNotiOpen] = useState(false);
  const { token } = theme.useToken();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  // Chọn menu theo path
  const selected = (() => {
    if (pathname.startsWith("/admin/listings")) return "listings";
    if (pathname.startsWith("/admin/accounts")) return "accounts";
    if (pathname.startsWith("/admin")) return "dashboard";
    return "dashboard";
  })();

  // Mock thông báo – sau nối BE/WS
  const notifications = [
    { id: 1, title: "Có 2 listing chờ duyệt", time: "10:35 hôm nay" },
    { id: 2, title: "Listing #100023 đã publish", time: "Hôm qua" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        width={240}
        // Không cần thu gọn → tắt trigger/collapsible
        trigger={null}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          position: "relative",
        }}
      >
        <SidebarBrand borderColor={token.colorBorderSecondary} />
        <SidebarProfile user={user} onClick={() => nav("/info-user")} />

        <SidebarMenu
          selected={selected}
          token={token}
          onClick={({ key }) => {
            if (key === "dashboard") nav("/admin");
            if (key === "accounts") nav("/admin/accounts");
            if (key === "listings") nav("/admin/listings");
          }}
        />

        <SidebarBottomActions
          onOpenNoti={() => setNotiOpen(true)}
          onLogout={async () => {
            try {
              await logout();
            } finally {
              nav("/");
            }
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            paddingInline: 16,
            fontWeight: 600,
          }}
        >
          Bảng điều khiển
        </Header>

        <Content style={{ padding: 16, background: token.colorBgLayout }}>
          <div style={{ background: "#fff", padding: 16 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      <NotificationDrawer
        open={notiOpen}
        onClose={() => setNotiOpen(false)}
        data={notifications}
      />
    </Layout>
  );
}
