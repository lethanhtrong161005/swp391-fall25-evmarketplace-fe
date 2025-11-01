import React from "react";
import { Layout, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import styles from "./Footer.module.scss";

const { Footer } = Layout;

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className={styles.footer}>
      <div className={styles.container}>
        <Row gutter={[32, 24]}>
          {/* About Us Section */}
          <Col xs={24} sm={12} md={8}>
            <Typography.Title level={5} className={styles.sectionTitle}>
              Về ReEV
            </Typography.Title>
            <div className={styles.linkList}>
              <Link to="/about" className={styles.link}>
                Giới thiệu về chúng tôi
              </Link>
              <span className={styles.textItem}>Tuyển dụng</span>
              <span className={styles.textItem}>Liên hệ hợp tác</span>
              <span className={styles.textItem}>Tin tức & Blog</span>
            </div>
          </Col>

          {/* Support Section */}
          <Col xs={24} sm={12} md={8}>
            <Typography.Title level={5} className={styles.sectionTitle}>
              Hỗ trợ khách hàng
            </Typography.Title>
            <div className={styles.linkList}>
              <span className={styles.textItem}>Trung tâm trợ giúp</span>
              <span className={styles.textItem}>Hướng dẫn mua bán xe</span>
              <span className={styles.textItem}>Chính sách bảo hành</span>
              <span className={styles.textItem}>Chính sách bảo mật</span>
              <span className={styles.textItem}>Điều khoản sử dụng</span>
            </div>
          </Col>

          {/* Contact Section */}
          <Col xs={24} sm={24} md={8}>
            <Typography.Title level={5} className={styles.sectionTitle}>
              Kết nối với ReEV
            </Typography.Title>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.facebook}`}
                aria-label="Facebook"
              >
                <FacebookOutlined />
                <span>Facebook</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.youtube}`}
                aria-label="YouTube"
              >
                <YoutubeOutlined />
                <span>YouTube</span>
              </a>
            </div>

            {/* Contact Info */}
            <div className={styles.contactItem}>
              <MailOutlined className={styles.contactIcon} />
              <div className={styles.contactText}>
                Email:{" "}
                <a href="mailto:support@reev.vn" className={styles.contactLink}>
                  support@reev.vn
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <PhoneOutlined className={styles.contactIcon} />
              <div className={styles.contactText}>
                Hotline:{" "}
                <a href="tel:1900123456" className={styles.contactLink}>
                  1900 123 456
                </a>
              </div>
            </div>

            <div className={styles.addressText}>
              Số 123, Đường ABC, Quận XYZ, TP. Hồ Chí Minh
            </div>
          </Col>
        </Row>

        {/* Copyright Section */}
        <div className={styles.copyright}>
          <Typography.Text className={styles.copyrightText}>
            © {currentYear} <strong>ReEV</strong> - Sàn giao dịch xe điện hàng
            đầu Việt Nam. All rights reserved.
          </Typography.Text>
        </div>
      </div>
    </Footer>
  );
}
