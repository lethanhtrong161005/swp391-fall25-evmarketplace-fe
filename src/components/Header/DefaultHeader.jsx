import React from "react";
import {
  Layout,
  Row,
  Col,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import HeaderNavbar from "../Navbar/HeaderNavbar";
import SearchBar from "../SearchBar/SearchBar";

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
          <div style={{ fontWeight: "bold", fontSize: "20px" }}>ReEV</div>
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
