// src/pages/Member/ProductDetail/components/ProductHeader/ProductHeader.jsx
import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ProductHeader.styles.scss";

export default function ProductHeader() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      onClick={handleGoBack}
      className="product-header__back-btn"
    >
      Quay lại
    </Button>
  );
}
