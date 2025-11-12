import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import styles from "./Footer.module.scss";
import logoImage from "@/assets/images/logo/Logo_Brand.png";

const { Footer } = Layout;
const { Title, Text } = Typography;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className={styles.footer}>
      <div className={styles.container}>
        <Row gutter={[32, 48]}>
          {/* Brand Section - Spans 2 columns on mobile, full width on tablet, 1 col on desktop */}
          <Col xs={24} sm={24} md={12} lg={24} xl={4}>
            <Space
              direction="vertical"
              size={16}
              className={styles.brandSection}
            >
              <div className={styles.logoWrapper}>
                <img
                  src={logoImage}
                  alt="ReEV Logo"
                  className={styles.logoImage}
                />
                <Title level={3} className={styles.brandName}>
                  ReEV
                </Title>
              </div>
              <Text className={styles.brandDescription}>
                Thị trường đáng tin cậy của bạn cho xe điện và pin đã qua sử
                dụng.
              </Text>
            </Space>
          </Col>

          {/* Company Section */}
          <Col xs={12} sm={12} md={6} lg={6} xl={4}>
            <Space
              direction="vertical"
              size={12}
              className={styles.footerSection}
            >
              <Title level={5} className={styles.sectionTitle}>
                Công ty
              </Title>
              <Link to="/about" className={styles.footerLink}>
                Về chúng tôi
              </Link>
              <Link to="/careers" className={styles.footerLink}>
                Tuyển dụng
              </Link>
              <Link to="/press" className={styles.footerLink}>
                Báo chí
              </Link>
            </Space>
          </Col>

          {/* Support Section */}
          <Col xs={12} sm={12} md={6} lg={6} xl={4}>
            <Space
              direction="vertical"
              size={12}
              className={styles.footerSection}
            >
              <Title level={5} className={styles.sectionTitle}>
                Hỗ trợ
              </Title>
              <Link to="/contact" className={styles.footerLink}>
                Liên hệ
              </Link>
              <Link to="/faq" className={styles.footerLink}>
                Câu hỏi thường gặp
              </Link>
              <Link to="/help" className={styles.footerLink}>
                Trung tâm trợ giúp
              </Link>
            </Space>
          </Col>

          {/* Legal Section */}
          <Col xs={12} sm={12} md={6} lg={6} xl={4}>
            <Space
              direction="vertical"
              size={12}
              className={styles.footerSection}
            >
              <Title level={5} className={styles.sectionTitle}>
                Pháp lý
              </Title>
              <Link to="/terms" className={styles.footerLink}>
                Điều khoản dịch vụ
              </Link>
              <Link to="/privacy" className={styles.footerLink}>
                Chính sách bảo mật
              </Link>
              <Link to="/cookies" className={styles.footerLink}>
                Chính sách cookie
              </Link>
            </Space>
          </Col>

          {/* Social Section */}
          <Col xs={12} sm={12} md={6} lg={6} xl={4}>
            <Space
              direction="vertical"
              size={12}
              className={styles.footerSection}
            >
              <Title level={5} className={styles.sectionTitle}>
                Theo dõi chúng tôi
              </Title>
              <div className={styles.socialLinks}>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label="Facebook"
                >
                  <FacebookOutlined />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label="Twitter"
                >
                  <TwitterOutlined />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label="Instagram"
                >
                  <InstagramOutlined />
                </a>
              </div>
            </Space>
          </Col>
        </Row>

        {/* Copyright Section */}
        <div className={styles.copyright}>
          <Text className={styles.copyrightText}>
            © {currentYear} ReEV, Inc. Bảo lưu mọi quyền.
          </Text>
        </div>
      </div>
    </Footer>
  );
}
