import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Menu, Button, Drawer, Grid } from "antd";
import HeaderAction from "../Action/HeaderAction";

const items = [
  { key: "home", label: "Trang chủ", path: "/" },
  { key: "vehicle", label: "Phương tiện", path: "/vehicle" },
  { key: "battery", label: "Pin", path: "/battery" },
];

const { useBreakpoint } = Grid;

const HeaderNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại
  const [current, setCurrent] = useState("home");
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();


useEffect(() => {
  // Tìm trong mảng items phần tử có path trùng với URL hiện tại
  const matchedItem = items.find((item) => item.path === location.pathname);

  // Nếu tìm thấy item khớp
  if (matchedItem) {
    // Cập nhật state current = key của item đó (để Menu highlight đúng)
    setCurrent(matchedItem.key);
  }

// useEffect sẽ chạy lại mỗi khi URL (location.pathname) thay đổi
}, [location.pathname]);


  const onClick = (e) => {
    setCurrent(e.key); // Đánh dấu menu đang chọn
    const selectedItem = items.find((item) => item.key === e.key); // Lấy item theo key
    if (selectedItem) {
      navigate(selectedItem.path); // Điều hướng sang trang mới
    }
    setOpen(false); // Đóng drawer khi click *mobile
  };

  return (
    <>
      {/* mobile */}
      {!screens.lg && (
        <>
          <Button
            className="menu-button"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />

          <Drawer
            title="Danh mục"
            placement="left"
            onClose={() => setOpen(false)}
            open={open}
          >
            <Menu
              mode="vertical"
              selectedKeys={[current]}
              items={items}
              onClick={onClick}
            />
            {/* actions hiển thị trong drawer */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <HeaderAction />
            </div>
          </Drawer>
        </>
      )}

      {/* desktop */}
      {screens.lg && (
        <>
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            items={items}
            onClick={onClick}
            style={{ flex: 1, borderBottom: "none" }}
          />
          <HeaderAction />
        </>
      )}
    </>
  );
};

export default HeaderNavbar;
