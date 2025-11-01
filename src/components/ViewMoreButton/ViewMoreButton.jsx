// src/components/ViewMoreButton/ViewMoreButton.jsx
import React from "react";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import "./ViewMoreButton.scss";

/**
 * Button "Xem thêm X tin đăng" với thiết kế đẹp
 */
export default function ViewMoreButton({ count, onClick, loading = false }) {
  return (
    <div className="view-more-button-wrapper">
      <Button
        type="default"
        size="large"
        onClick={onClick}
        loading={loading}
        className="view-more-button"
      >
        Xem thêm {count > 0 ? count.toLocaleString("vi-VN") : ""} tin đăng
        <RightOutlined />
      </Button>
    </div>
  );
}
