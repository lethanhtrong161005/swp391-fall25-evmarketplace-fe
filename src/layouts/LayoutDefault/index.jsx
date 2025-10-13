import React from "react";
import { Layout } from "antd";

import SiteFooter from "@components/Footer";

import { Outlet, Link, useLocation } from "react-router-dom";
import DefaultHeader from "@components/Header/DefaultHeader";
import SearchBar from "@components/SearchBar/SearchBar";
const { Content, Header, Footer } = Layout;

const LayoutDefault = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/listing/new") || location.pathname.startsWith("/listing/edit");
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


        {!hideFooter && <SiteFooter />}
      </Layout>
    </>
  );
};

export default LayoutDefault;
