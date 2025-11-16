import React from "react";
import { Typography, Layout } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatPage from "@components/Chat/ChatPage/index";
import DynamicBreadcrumb from "@/components/Breadcrumb/Breadcrumb";
import styles from "../shared/ListingPage.module.scss";

const { Title } = Typography;
const { Content } = Layout;

/**
 * Chat page - Main chat interface page
 */
const Chat = () => {
  return (
    <Layout className={styles.layoutContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbSection}>
        <DynamicBreadcrumb />
      </div>

      {/* Page Title */}
      <div className={styles.pageTitleSection}>
        <Title level={2} className={styles.pageTitle}>
          <MessageOutlined style={{ color: "#1890ff" }} />
          Tin nhắn
        </Title>
      </div>

      {/* Main Content */}
      <Content className={styles.content}>
        <ChatPage />
      </Content>
    </Layout>
  );
};

export default Chat;

