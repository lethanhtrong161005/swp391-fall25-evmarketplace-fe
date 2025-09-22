import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import LoginModal from "@components/Modal/LoginModal";
import { useAuth } from "@hooks/useAuth";


const HeaderAction = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { isLoggedIn, user, login, logout } = useAuth();
  const navigate = useNavigate();


  const menuItems = [
    { key: "infouser", label: "Hồ sơ", path: "/infouser" },
    { key: "logout", label: "Đăng xuất", path: "/logout" },
  ];

  const handleMenuClick = async ({ key }) => {
    if (key === "infouser") navigate("/info-user"); // <- SỬA: đúng path theo routes
    if (key === "logout") await logout();
  };

 
  const handleLoginSubmit = async (dto) => {
    await login(dto);            // loginPhone + setUser đã nằm trong context
    return true;                 // để modal tự đóng (vì resolve)
  };

  const displayName = user?.fullName || user?.name || user?.sub || "Hồ sơ";

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button>Đăng tin</Button>

      {isLoggedIn ? (
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button icon={<UserOutlined />} type="text">
            {displayName}
          </Button>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={() => setShowLogin(true)}>
          Đăng nhập
        </Button>
      )}

      {/* Gắn modal ngay tại đây và điều khiển bằng state */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSubmit={handleLoginSubmit}
      />
    </div>
  );
};

export default HeaderAction;

