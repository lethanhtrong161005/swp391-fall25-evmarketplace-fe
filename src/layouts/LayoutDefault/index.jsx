import React from "react";
import { Layout } from "antd";

import SiteFooter from "../../components/Footer";

import { Outlet, Link } from "react-router-dom";
import DefaultHeader from "../../components/Header/DefaultHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
const { Content, Header, Footer } = Layout;

const LayoutDefault = () => {
  return (
    <>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: 0,
            height: "138px",
            lineHeight: "normal",
            gap: "64px",
          }}
        >
          <DefaultHeader />
          <SearchBar />
        </Header>

        <Content style={{ padding: "16px 40px", background: "#f0f2f5" }}>
          <Outlet />
        </Content>

        <SiteFooter />
      </Layout>
    </>
  );
};

export default LayoutDefault;
