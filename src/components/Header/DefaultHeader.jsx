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
      style={{ background: "#fff", paddingLeft: "16px", paddingRight: "16px" }}
    >
      <Row align="middle" gutter={16}>
        <Col
          xs={20}
          sm={20}
          md={20}
          lg={{ span: 4, offset: 0 }}
          xl={{ span: 4, offset: 0 }}
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
          }}
        >
          <HeaderNavbar />
        </Col>
      </Row>
    </Header>
  );
};

export default DefaultHeader;
