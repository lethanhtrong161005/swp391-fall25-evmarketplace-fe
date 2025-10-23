import React from "react";
import { Card, Row, Col, Statistic, Typography, Button } from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function ModeratorDashboard() {
  const navigate = useNavigate();

  const handleGoToApproval = () => {
    navigate("/moderator/approval");
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Bảng điều khiển Moderator
            </Title>
            <Text type="secondary">
              Quản lý và duyệt các tin đăng trong hệ thống
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<FileTextOutlined />}
              onClick={handleGoToApproval}
            >
              Bắt đầu duyệt bài
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin đăng chờ duyệt"
              value={0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Các tin đăng đang chờ được duyệt
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang duyệt"
              value={0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tin đăng đang được bạn duyệt
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã duyệt hôm nay"
              value={0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tin đăng đã duyệt trong ngày
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã từ chối hôm nay"
              value={0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tin đăng đã từ chối trong ngày
            </Text>
          </Card>
        </Col>
      </Row>

      <Card title="Hướng dẫn sử dụng" style={{ marginTop: 24 }} size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div>
              <Title level={5}>Quy trình duyệt bài:</Title>
              <ol>
                <li>Chọn tin đăng từ hàng đợi để bắt đầu duyệt</li>
                <li>Tin đăng sẽ được khóa để tránh xung đột</li>
                <li>Xem xét thông tin chi tiết của tin đăng</li>
                <li>Quyết định duyệt hoặc từ chối</li>
                <li>Nếu từ chối, cần nhập lý do cụ thể</li>
              </ol>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Title level={5}>Lưu ý quan trọng:</Title>
              <ul>
                <li>Mỗi tin đăng có thời gian khóa giới hạn (10 phút)</li>
                <li>Có thể gia hạn thời gian duyệt nếu cần</li>
                <li>Có thể nhả khóa tin đăng để quay lại hàng đợi</li>
                <li>Lý do từ chối phải rõ ràng và có ích cho người đăng</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
