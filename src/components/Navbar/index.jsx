import React, { useState } from "react";
import { Layout, Menu, Input, Button, Space, Typography, Avatar } from "antd";
import { SearchOutlined, BorderOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;

const NAV_ITEMS = [
  { key: "home", label: "Trang chủ", path: "/" },
  { key: "car", label: "Xe ô tô", path: "/car" },
  { key: "motor", label: "Xe máy", path: "/motor" },
  { key: "bike", label: "Xe đạp", path: "/bike" },
  { key: "battery", label: "Pin", path: "/battery" },
];

export default function Navbar({ onOpenLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState("home");

  React.useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = NAV_ITEMS.find((item) => item.path === currentPath);
    setCurrent(currentItem ? currentItem.key : "home");
  }, [location.pathname]);

  const onClick = (e) => {
    setCurrent(e.key);
    const selectedItem = NAV_ITEMS.find((item) => item.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const onSearch = (value) => {
    const q = value?.trim();
    if (!q) return;
    navigate(`/listings?query=${encodeURIComponent(q)}`);
  };

  const handleLogin = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      navigate("/login");
    }
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "#fff",
        paddingInline: 16,
        width: "100%",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Link to="/">
        <Space size={12} align="center">
          <Avatar shape="square" icon={<BorderOutlined />} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            ReEV
          </Typography.Title>
        </Space>
      </Link>

      <Input
        placeholder="Search"
        prefix={<SearchOutlined style={{ color: "#e9e9e9" }} />}
        onPressEnter={(e) => onSearch(e.target.value)}
        style={{
          maxWidth: 360,
        }}
      />

      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        style={{ flex: 1, borderBottom: "none" }}
        items={NAV_ITEMS.map((item) => ({
          key: item.key,
          label: item.label,
        }))}
      />

      <Space>
        <Button
          type="default"
          size="middle"
          onClick={() => navigate("/listings/new")}
        >
          Đăng tin
        </Button>

        <Button type="primary" size="middle" onClick={handleLogin}>
          Đăng nhập
        </Button>
      </Space>
    </Header>
  );
}
