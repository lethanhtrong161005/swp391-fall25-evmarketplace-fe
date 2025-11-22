import React from "react";
import { Layout } from "antd";

import SiteFooter from "@components/Footer";

import { Outlet, Link, useLocation } from "react-router-dom";
import DefaultHeader from "@components/Header/DefaultHeader";
import SearchBar from "@components/SearchBar/SearchBar";
const { Content, Header, Footer } = Layout;

const LayoutDefault = () => {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/listing/new") ||
    location.pathname.startsWith("/listing/edit");
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          style={{
            background: "#fff",
            padding: 0,
            lineHeight: "normal",
            gap: "64px",
            flexShrink: 0,
          }}
        >
          <DefaultHeader />
          {/* <SearchBar /> */}
        </Header>

        <Content
          style={{
            padding: "16px",
            background: "#E9F2FF",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Content>

        {!hideFooter && <SiteFooter />}
      </Layout>
    </>
  );
};

export default LayoutDefault;
