import React from "react";
import { Card, Row, Col, Statistic, theme } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const ManagerDashboard = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "24px", background: token.colorBgLayout }}>
      <h1 style={{ marginBottom: "24px", color: token.colorTextHeading }}>
        Dashboard Quản lý
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng nhân viên"
              value={25}
              prefix={<UserOutlined />}
              valueStyle={{ color: token.colorPrimary }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin đăng đang chờ"
              value={156}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: token.colorWarning }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin đăng đã duyệt"
              value={1243}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={2890}
              prefix={<ShopOutlined />}
              valueStyle={{ color: token.colorInfo }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboard;
