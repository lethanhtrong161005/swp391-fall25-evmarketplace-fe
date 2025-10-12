import React, { useEffect, useMemo, useState } from "react";
import { Menu, Dropdown, Space, Avatar } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  DownOutlined,
  AppstoreOutlined,
  TagsOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

export default function SidebarStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // 🟦 Cấu hình menu
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/staff",
    },
    {
      key: "posts",
      icon: <FileTextOutlined />,
      label: "Quản lý đăng tin",
      path: "/staff/listingmanagement",
    },
    {
      key: "product-management",
      icon: <AppstoreOutlined />,
      label: "Quản lý sản phẩm",
      children: [
        {
          key: "category",
          label: "Quản lý danh mục",
          path: "/admin/product/category",
        },

        {
          key: "brand",
          label: "Quản lý thương hiệu",
          path: "/admin/product/brand",
        },

        {
          key: "model",
          label: "Quản lý mẫu mã",
          path: "/admin/product/model",
        },
        {
          key: "vehicle",
          label: "Quản lý phương tiện",
          path: "/admin/product/vehicle",
        },
        {
          key: "battery",
          label: "Quản lý pin",
          path: "/admin/product/battery",
        },
      ],
    },
    {
      key: "account",
      icon: <UserOutlined />,
      label: "Tài khoản",
      path: "/staff/account",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      path: "/staff/settings",
    },
  ];

  // Flatten items để tính selected & openKeys chính xác
  const flatItems = useMemo(() => {
    const acc = [];
    const walk = (items, parentKey = null) => {
      items.forEach((it) => {
        if (it.path) acc.push({ key: it.key, path: it.path, parentKey });
        if (it.children) walk(it.children, it.key);
      });
    };
    walk(menuItems);
    return acc;
  }, []);

  // Tìm key khớp nhất theo URL (ưu tiên path dài nhất)
  const currentKey = useMemo(() => {
    const p = location.pathname;
    const candidates = flatItems.filter((i) => {
      // exact hoặc prefix dạng "/a/b" khớp "/a/b/..."
      if (p === i.path) return true;
      return p.startsWith(i.path.endsWith("/") ? i.path : i.path + "/");
    });
    if (candidates.length === 0) {
      // fallback: vẫn có thể đang ở /staff => match dashboard
      const dash = flatItems.find((i) => i.key === "dashboard");
      return dash ? dash.key : undefined;
    }
    // Most-specific: path dài nhất
    candidates.sort((a, b) => b.path.length - a.path.length);
    return candidates[0].key;
  }, [location.pathname, flatItems]);

  // Tính chuỗi parent để mở submenu (openKeys controlled)
  const parentMap = useMemo(() => {
    const m = new Map();
    flatItems.forEach((i) => m.set(i.key, i.parentKey));
    return m;
  }, [flatItems]);

  const computeOpenKeys = (leafKey) => {
    const keys = [];
    let k = leafKey;
    while (k && parentMap.get(k)) {
      const parent = parentMap.get(k);
      keys.push(parent);
      k = parent;
    }
    return keys;
  };

  const [openKeys, setOpenKeys] = useState(() => computeOpenKeys(currentKey));

  // Cập nhật openKeys theo URL mỗi khi điều hướng
  useEffect(() => {
    setOpenKeys(computeOpenKeys(currentKey));
  }, [currentKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dropdown user
  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Hồ sơ",
        onClick: () => navigate("/staff/info"),
      },
      {
        key: "logout",
        label: "Đăng xuất",
        onClick: () => {
          logout();
          navigate("/login");
        },
      },
    ],
  };

  const handleMenuClick = ({ key }) => {
    const found = flatItems.find((i) => i.key === key);
    if (found?.path) navigate(found.path);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: 16, fontWeight: 700, fontSize: 18 }}>
        ReEV Staff
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={currentKey ? [currentKey] : []}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        onClick={handleMenuClick}
        style={{ flex: 1, borderRight: 0 }}
        theme="light"
      />

      {/* Style highlight */}
      <style>
        {`
        .ant-menu-item-selected {
          background-color: #e6f7ff !important;
        }
        .ant-menu-item-selected .ant-menu-title-content,
        .ant-menu-item-selected .anticon {
          color: #1890ff !important;
        }
        `}
      </style>

      {/* User info */}
      <div style={{ padding: 16, borderTop: "1px solid #f0f0f0" }}>
        <Dropdown menu={userMenu} placement="topLeft" trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} src={user?.avatar || null} />
            <span>{user?.fullName || user?.username || "Người dùng"}</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
}
