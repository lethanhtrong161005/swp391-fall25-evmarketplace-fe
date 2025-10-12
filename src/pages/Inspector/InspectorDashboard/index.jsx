import React from "react";
import { Card, Row, Col, Statistic, theme } from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const InspectorDashboard = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "24px", background: token.colorBgLayout }}>
      <h1 style={{ marginBottom: "24px", color: token.colorTextHeading }}>
        Dashboard Kỹ thuật viên
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Xe cần kiểm định hôm nay"
              value={8}
              prefix={<SearchOutlined />}
              valueStyle={{ color: token.colorPrimary }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={45}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lỗi kỹ thuật phát hiện"
              value={12}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: token.colorError }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang chờ xử lý"
              value={3}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: token.colorWarning }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InspectorDashboard;
