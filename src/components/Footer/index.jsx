import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer
      style={{
        background: "#fff",
        borderTop: "1px solid #f0f0f0",
        padding: "32px 24px 16px 24px",
      }}
    >
      <Row gutter={[24, 16]}>
        {/* About Us Section */}
        <Col xs={24} md={8}>
          <Typography.Title
            level={5}
            style={{ marginTop: 0, color: "#1890ff" }}
          >
            Về ReEV
          </Typography.Title>
          <Space direction="vertical" size="small">
            <Link to="/about" style={{ color: "#666", textDecoration: "none" }}>
              <Typography.Text>Giới thiệu về chúng tôi</Typography.Text>
            </Link>
            <Typography.Text style={{ color: "#666" }}>
              Tuyển dụng
            </Typography.Text>
            <Typography.Text style={{ color: "#666" }}>
              Liên hệ hợp tác
            </Typography.Text>
            <Typography.Text style={{ color: "#666" }}>
              Tin tức & Blog
            </Typography.Text>
          </Space>
        </Col>

        {/* Support Section */}
        <Col xs={24} md={8}>
          <Typography.Title
            level={5}
            style={{ marginTop: 0, color: "#1890ff" }}
          >
            Hỗ trợ khách hàng
          </Typography.Title>
          <Space direction="vertical" size="small">
            <Typography.Text style={{ color: "#666" }}>
              Trung tâm trợ giúp
            </Typography.Text>
            <Typography.Text style={{ color: "#666" }}>
              Hướng dẫn mua bán xe
            </Typography.Text>
            <Typography.Text style={{ color: "#666" }}>
              Chính sách bảo hành
            </Typography.Text>
            <Typography.Text style={{ color: "#666" }}>
              Chính sách bảo mật
            </Typography.Text>
            <Typography.Text style={{ color: "#666" }}>
              Điều khoản sử dụng
            </Typography.Text>
          </Space>
        </Col>

        {/* Contact Section */}
        <Col xs={24} md={8}>
          <Typography.Title
            level={5}
            style={{ marginTop: 0, color: "#1890ff" }}
          >
            Kết nối với ReEV
          </Typography.Title>
          <Space direction="vertical" size="small">
            <Space size="middle">
              <Typography.Link
                href="https://facebook.com"
                target="_blank"
                style={{ color: "#1877f2" }}
              >
                <FacebookOutlined /> Facebook
              </Typography.Link>
              <Typography.Link
                href="https://youtube.com"
                target="_blank"
                style={{ color: "#ff0000" }}
              >
                <YoutubeOutlined /> YouTube
              </Typography.Link>
            </Space>

            <Space align="start">
              <MailOutlined style={{ color: "#666" }} />
              <Typography.Text style={{ color: "#666" }}>
                Email:{" "}
                <Typography.Link href="mailto:support@reev.vn">
                  support@reev.vn
                </Typography.Link>
              </Typography.Text>
            </Space>

            <Space align="start">
              <PhoneOutlined style={{ color: "#666" }} />
              <Typography.Text style={{ color: "#666" }}>
                Hotline:{" "}
                <Typography.Link href="tel:1900123456">
                  1900 123 456
                </Typography.Link>
              </Typography.Text>
            </Space>

            <Typography.Text style={{ color: "#999", fontSize: "12px" }}>
              Địa chỉ: Số 123, Đường ABC, Quận XYZ, TP. Hồ Chí Minh
            </Typography.Text>
          </Space>
        </Col>
      </Row>

      {/* Copyright Section */}
      <Row
        style={{
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Col span={24}>
          <div style={{ textAlign: "center" }}>
            <Typography.Text style={{ color: "#999", fontSize: "14px" }}>
              © {currentYear} ReEV - Sàn giao dịch xe điện hàng đầu Việt Nam.
              All rights reserved.
            </Typography.Text>
          </div>
        </Col>
      </Row>
    </Footer>
  );
}
