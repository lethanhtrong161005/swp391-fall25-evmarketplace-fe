// src/pages/Member/ProductDetail/components/ProductMedia/components/EmptyState.jsx
import React, { memo } from "react";
import { Empty, Typography } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import "./EmptyState.scss";

const { Text } = Typography;

const EmptyState = memo(() => (
  <div className="empty-state">
    <Empty
      image={
        <PictureOutlined
          style={{
            fontSize: 64,
            color: "#d9d9d9",
          }}
        />
      }
      description={
        <Text type="secondary" className="empty-state__description">
          Chưa có hình ảnh sản phẩm
        </Text>
      }
    />
  </div>
));

EmptyState.displayName = "EmptyState";

export default EmptyState;
