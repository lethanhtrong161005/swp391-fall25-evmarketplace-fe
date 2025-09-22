import React from "react";
import { Layout } from "antd";
import SiteFooter from "../../components/Footer";
import { Outlet, Link } from 'react-router-dom'
import DefaultHeader from '../../components/Header/DefaultHeader';

const { Content } = Layout;

const LayoutDefault = () => {
  return (
    <>
      <Layout>

        <DefaultHeader/>

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
    </>
  );
};


export default LayoutDefault;
