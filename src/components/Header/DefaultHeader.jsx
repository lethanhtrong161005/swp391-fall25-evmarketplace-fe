import React from "react";
import { Layout, Row, Col, Avatar, Typography, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import HeaderNavbar from "../Navbar/HeaderNavbar";
import SearchBar from "../SearchBar/SearchBar";
import logo from "@assets/images/logo/Logo_Brand.png";

const { Header } = Layout;

const DefaultHeader = () => {
  return (
    <Header
      style={{ background: "#fff", paddingLeft: "16px", paddingRight: "16px" }}
    >
      <Row align="middle" gutter={16}>
        <Col
          xs={20}
          sm={20}
          md={20}
          lg={{ span: 2, offset: 0 }}
          xl={{ span: 2, offset: 0 }}
        >
          <Space>
            <Avatar shape="square" size={64} src={logo} />
            <Typography.Title level={3} style={{ margin: 0 }}>
              ReEV
            </Typography.Title>
          </Space>
        </Col>
        <Col
          xs={2}
          sm={2}
          md={2}
          lg={{ span: 14, offset: 8 }}
          xl={{ span: 14, offset: 8 }}
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
