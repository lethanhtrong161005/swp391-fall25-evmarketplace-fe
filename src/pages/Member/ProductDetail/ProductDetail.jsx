// src/pages/Member/ProductDetail/ProductDetail.jsx
import React, { useState } from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useProductDetail } from "./hooks/useProductDetail";
import ProductHeader from "./components/ProductHeader/ProductHeader";
import ProductMedia from "./components/ProductMedia/ProductMedia";
import ProductInfo from "./components/ProductInfo/ProductInfo";
import LoginModal from "@components/Modal/LoginModal";
import { useAuth } from "@hooks/useAuth";

import ProductDescription from "./components/ProductDescription/ProductDescription";
import ProductSpecifications from "./components/ProductSpecifications/ProductSpecifications";
import CompatibleModels from "./components/CompatibleModels/CompatibleModels";
import "./ProductDetail.styles.scss";

const { Title } = Typography;

export default function ProductDetail() {
  const navigate = useNavigate();
  const { product, loading, error, isBattery, isNotFound } = useProductDetail();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { login } = useAuth();

  // Xử lý đăng nhập
  const handleLogin = async (loginDto) => {
    await login(loginDto);
  };

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleGoToRegister = () => {
    setShowLoginModal(false);
    navigate("/register");
  };

  const handleForgotPassword = (phoneNumber) => {
    setShowLoginModal(false);
    navigate("/forgot-password", { state: { phoneNumber } });
  };

  // Trạng thái đang tải
  if (loading) {
    return (
      <Card className="product-detail__section">
        <Title level={4}>Đang tải...</Title>
      </Card>
    );
  }

  // Trạng thái lỗi
  if (error) {
    return (
      <Card className="product-detail__section">
        <Title level={4}>Có lỗi xảy ra khi tải sản phẩm</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Card>
    );
  }

  // Trạng thái không tìm thấy
  if (isNotFound) {
    return (
      <Card className="product-detail__section">
        <Title level={4}>Không tìm thấy sản phẩm</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Card>
    );
  }

  return (
    <div className="product-detail">
      {/* Header với nút quay lại */}
      <ProductHeader />

      {/* Nội dung chính: Media + Thông tin */}
      <Card className="product-detail__section">
        <Row gutter={24}>
          <Col xs={24} md={14}>
            <ProductMedia product={product} />
          </Col>
          <Col xs={24} md={10}>
            <ProductInfo
              product={product}
              onShowLoginModal={handleShowLoginModal}
            />
          </Col>
        </Row>
      </Card>

      {/* Layout cho các section dưới: Mô tả + Thông số */}
      <Row gutter={24}>
        <Col xs={24} md={14}>
          {/* Mô tả chi tiết */}
          <ProductDescription product={product} />

          {/* Thông số kỹ thuật */}
          <ProductSpecifications product={product} isBattery={isBattery} />
        </Col>
        <Col xs={24} md={10}>
          {/* Mẫu xe tương thích (chỉ cho pin) */}
          <CompatibleModels product={product} isBattery={isBattery} />
        </Col>
      </Row>

      {/* Modal đăng nhập */}
      <LoginModal
        open={showLoginModal}
        onClose={handleCloseLoginModal}
        onSubmit={handleLogin}
        onForgot={handleForgotPassword}
        onGoRegister={handleGoToRegister}
      />
    </div>
  );
}
