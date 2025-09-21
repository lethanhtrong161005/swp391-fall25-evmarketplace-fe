import React, { useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Space,
  Typography,
  Avatar,
  Drawer,
  Row,
  Col,
} from "antd";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@assets/images/logo/Logo_Brand.png";
import useResponsive, {
  getLogoSize,
  getHeaderPadding,
  getElementGap,
  getSearchWidth,
  getNavbarColSpans,
} from "@utils/responsive.jsx";

const { Header } = Layout;

const NAV_ITEMS = [
  { key: "home", label: "Trang chủ", path: "/" },
  { key: "car", label: "Xe ô tô", path: "/car" },
  { key: "motor", label: "Xe máy", path: "/motor" },
  { key: "bike", label: "Xe đạp", path: "/bike" },
];

export default function Navbar({ onOpenLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceType, isMobile, isTablet } = useResponsive();
  const [current, setCurrent] = useState("home");
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Responsive values for layout adjustments
  const logoSize = getLogoSize(deviceType);
  const headerPadding = getHeaderPadding(deviceType);
  const elementGap = getElementGap(deviceType);
  const searchWidth = getSearchWidth(deviceType);
  const colSpans = getNavbarColSpans(deviceType);

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

  const renderMobileMenu = () => (
    <Drawer
      title={
        <Space>
          <Avatar shape="square" size={64} src={logo} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            ReEV
          </Typography.Title>
        </Space>
      }
      placement="left"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      width={280}
      styles={{ body: { padding: 0 } }}
    >
      {/* Mobile navigation menu */}
      <Menu
        onClick={(e) => {
          onClick(e);
          setMobileMenuVisible(false);
        }}
        selectedKeys={[current]}
        mode="vertical"
        style={{ border: "none" }}
        items={NAV_ITEMS.map((item) => ({
          key: item.key,
          label: item.label,
        }))}
      />
      <div style={{ padding: elementGap, borderTop: "1px solid #f0f0f0" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="default"
            onClick={() => {
              navigate("/listings/new");
              setMobileMenuVisible(false);
            }}
            style={{ width: "100%" }}
          >
            Đăng tin
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleLogin();
              setMobileMenuVisible(false);
            }}
            style={{ width: "100%" }}
          >
            Đăng nhập
          </Button>
        </Space>
      </div>
    </Drawer>
  );

  return (
    <>
      <Header
        className="navbar-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          padding: headerPadding,
          borderBottom: "1px solid #f0f0f0",
          height: isMobile ? "56px" : "64px",
        }}
      >
        <Row
          align="middle"
          justify="start"
          gutter={0}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Logo Section */}
          <Col {...colSpans.logo} flex={isMobile ? undefined : "none"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: elementGap,
                width: "fit-content",
              }}
            >
              {/* Hamburger menu for mobile/tablet */}
              {(isMobile || isTablet) && (
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileMenuVisible(true)}
                  style={{ padding: "4px 8px" }}
                />
              )}

              {/* Compact logo */}
              <Link to="/">
                <Space size={isMobile ? 6 : 8} align="center">
                  <Avatar shape="square" size={logoSize} src={logo} />
                  <Typography.Title
                    level={isMobile ? 5 : 4}
                    style={{
                      margin: 0,
                      fontSize: isMobile ? "16px" : undefined,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ReEV
                  </Typography.Title>
                </Space>
              </Link>
            </div>
          </Col>

          {/* Search Bar Section */}
          {colSpans.search.span > 0 && (
            <Col
              {...colSpans.search}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingLeft: isMobile ? 0 : elementGap,
              }}
            >
              <Input.Search
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                onSearch={onSearch}
                style={{ width: searchWidth, maxWidth: "100%" }}
                enterButton={false}
              />
            </Col>
          )}

          {/* Navigation Menu Section */}
          {colSpans.menu.span > 0 && (
            <Col
              {...colSpans.menu}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "400px",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  overflow: "visible",
                }}
              >
                <Menu
                  onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  overflowedIndicator={null}
                  style={{
                    borderBottom: "none",
                    display: "flex",
                    justifyContent: "center",
                    background: "transparent",
                    fontSize: "14px",
                    fontWeight: "500",
                    minWidth: "fit-content",
                    width: "100%",
                    overflow: "visible",
                  }}
                  items={NAV_ITEMS.map((item) => ({
                    key: item.key,
                    label: item.label,
                    style: {
                      padding: "0 12px",
                      whiteSpace: "nowrap",
                    },
                  }))}
                />
              </div>
            </Col>
          )}

          {/* Action Buttons Section */}
          {colSpans.actions.span > 0 && (
            <Col
              {...colSpans.actions}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Space size={elementGap}>
                <Button
                  type="default"
                  onClick={() => navigate("/listings/new")}
                  size="middle"
                >
                  Đăng tin
                </Button>
                <Button type="primary" onClick={handleLogin} size="middle">
                  Đăng nhập
                </Button>
              </Space>
            </Col>
          )}
        </Row>
      </Header>

      {/* Mobile Search Bar*/}
      {isMobile && (
        <div
          style={{
            background: "#fff",
            padding: "8px 12px",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: "56px",
            zIndex: 999,
          }}
        >
          <Row>
            <Col span={24}>
              <Input.Search
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                onSearch={onSearch}
                enterButton={false}
                size="middle"
                style={{
                  borderRadius: "6px",
                }}
              />
            </Col>
          </Row>
        </div>
      )}

      {renderMobileMenu()}
    </>
  );
}
