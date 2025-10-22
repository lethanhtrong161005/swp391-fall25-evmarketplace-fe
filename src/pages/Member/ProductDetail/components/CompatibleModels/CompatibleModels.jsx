// src/pages/Member/ProductDetail/components/CompatibleModels/CompatibleModels.jsx
import React from "react";
import { Card, List, Typography } from "antd";
import { BranchesOutlined } from "@ant-design/icons";
import "./CompatibleModels.styles.scss";

const { Title } = Typography;

export default function CompatibleModels({ product, isBattery }) {
  if (!isBattery || !product?.compatibleModels?.length) {
    return null;
  }

  return (
    <Card className="compatible-models">
      <Title level={4} className="compatible-models__title">
        Tương thích với các dòng xe
      </Title>
      <List
        dataSource={product.compatibleModels}
        renderItem={(item) => (
          <List.Item className="compatible-models__item">
            <BranchesOutlined className="compatible-models__icon" />
            <span className="compatible-models__text">
              {item.brand} {item.model} – Tầm hoạt động {item.rangeKm} km
            </span>
          </List.Item>
        )}
        className="compatible-models__list"
      />
    </Card>
  );
}
