// src/pages/Member/ProductDetail/components/ProductDescription/ProductDescription.jsx
import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "./ProductDescription.styles.scss";

const { Title, Paragraph } = Typography;

export default function ProductDescription({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!product) return null;

  const description =
    product.description ||
    product.productVehicle?.description ||
    product.productBattery?.description ||
    "Chưa có mô tả chi tiết.";

  // Kiểm tra xem có cần hiển thị nút "Xem thêm" không
  const shouldShowToggle = description.length > 200;
  const displayText =
    isExpanded || !shouldShowToggle
      ? description
      : description.substring(0, 200) + "...";

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="product-description">
      <Title level={4} className="product-description__title">
        Mô tả chi tiết
      </Title>
      <Paragraph className="product-description__content">
        {displayText}
      </Paragraph>
      {shouldShowToggle && (
        <div className="product-description__toggle">
          <Button
            type="text"
            onClick={handleToggle}
            className="product-description__toggle-btn"
            icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </Button>
        </div>
      )}
    </Card>
  );
}
