import React from "react";
import { Layout, Row, Col, Avatar, Typography, Space, Grid } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "@components/Navbar/HeaderNavbar";
import SearchBar from "@components/SearchBar/SearchBar";
import logo from "@assets/images/logo/Logo_Brand.png";

const { Header } = Layout;

const DefaultHeader = () => {
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const avatarSize = screens.lg ? 64 : screens.md ? 56 : 48;
  const titleStyle = {
    margin: 0,
    whiteSpace: "nowrap",
    fontSize: screens.lg ? 20 : screens.md ? 18 : 16,
    lineHeight: 1.2,
  };

  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <Header
      style={{ 
        background: "#fff", 
        paddingLeft: "16px", 
        paddingRight: "16px",
        overflow: "visible", // Đảm bảo dropdown không bị cắt
        position: "relative", // Đảm bảo z-index hoạt động đúng
        zIndex: 1000, // Đảm bảo header luôn trên content nhưng dưới dropdown (1060)
      }}
    >
      <Row align="middle" gutter={16} style={{ overflow: "visible" }}>
        <Col
          xs={20}
          sm={20}
          md={20}
          lg={{ span: 4, offset: 0 }}
          xl={{ span: 4, offset: 0 }}
          style={{ overflow: "visible" }}
        >
          <Space
            wrap={false}
            style={{ cursor: "pointer" }}
            onClick={handleLogoClick}
          >
            <Avatar shape="square" size={avatarSize} src={logo} />
            <Typography.Title level={4} style={titleStyle}>
              ReEV
            </Typography.Title>
          </Space>
        </Col>
        <Col
          xs={2}
          sm={2}
          md={2}
          lg={{ span: 14, offset: 6 }}
          xl={{ span: 14, offset: 6 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            overflow: "visible", // Đảm bảo dropdown không bị cắt
            minWidth: 0, // Cho phép shrink khi cần
          }}
        >
          <HeaderNavbar />
        </Col>
      </Row>
    </Header>
  );
};

export default DefaultHeader;
