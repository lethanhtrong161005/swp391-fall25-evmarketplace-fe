import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import SidebarStaff from "../../components/Sidebar/SidebarStaff";

const { Sider, Content } = Layout;


const LayoutStaff = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" width={240}>
        <SidebarStaff/>
      </Sider>
      <Layout>
        <Content style={{ padding: 24, background: "#f9f9f9" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutStaff;
