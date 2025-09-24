import React from "react";
import { Typography, Card, Button, Space, theme, Row, Col } from "antd";
import { ThunderboltOutlined, SendOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function CTABanner({
  onStartBuying,
  onConsignVehicle,
  title = "Sẵn sàng tìm chiếc EV/phụ kiện pin phù hợp?",
  description = "Khám phá sản phẩm đã thẩm định hoặc boost nổi bật. Ký gửi nhanh – bán đúng giá.",
  buyText = "Bắt đầu mua",
  consignText = "Ký gửi ngay",
}) {
  const { token } = theme.useToken();

  return (
    <section style={{ margin: "48px 0" }}>
      <Card
        style={{
          background: `linear-gradient(90deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
          color: "#fff",
          overflow: "hidden",
          borderRadius: 16,
          border: "none",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: "#fff", margin: 0 }}>
              {title}
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.9)", marginTop: 8 }}>
              {description}
            </Paragraph>

            <Space wrap>
              <Button
                size="large"
                type="default"
                icon={<ThunderboltOutlined />}
                onClick={onStartBuying}
              >
                {buyText}
              </Button>
              <Button
                size="large"
                ghost
                style={{ color: "#fff", borderColor: "#fff" }}
                icon={<SendOutlined />}
                onClick={onConsignVehicle}
              >
                {consignText}
              </Button>
            </Space>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              <strong>Miễn phí</strong> đăng tin • <strong>3%</strong> hoa hồng
              ký gửi • VNPay
            </Text>
          </Col>
        </Row>
      </Card>
    </section>
  );
}
