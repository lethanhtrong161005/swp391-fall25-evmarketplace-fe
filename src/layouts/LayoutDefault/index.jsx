import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/Footer";

const { Content } = Layout;

const LayoutDefault = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />

      <Content style={{ padding: "20px", background: "#f0f2f5" }}>
        <div
          style={{
            background: "#fff",
            minHeight: "280px",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Outlet />
        </div>
      </Content>

      <SiteFooter />
    </Layout>
  );
};

export default LayoutDefault;
