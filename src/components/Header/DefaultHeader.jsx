import React from "react";
import { Layout, Row, Col } from "antd";
import HeaderNavbar from "@components/Navbar/HeaderNavbar";
import Logo from "@components/Logo/Logo";

const { Header } = Layout;

const DefaultHeader = () => {
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
          <Logo variant="header" />
        </Col>
        <Col
          xs={2}
          sm={2}
          md={2}
          lg={{ span: 15, offset: 5 }}
          xl={{ span: 15, offset: 5 }}
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
