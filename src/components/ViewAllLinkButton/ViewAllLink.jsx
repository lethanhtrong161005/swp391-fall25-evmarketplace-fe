// src/components/ViewAllLinkButton/ViewAllLink.jsx
import React from "react";
import { Button } from "antd";

/**
 * Nút "Xem tất cả ..." dùng chung (type="link")
 * Hiển thị: label + tổng số (count)
 */
export default function ViewAllLink({
  count = 0,
  label = "Xem tất cả",
  onClick,
  size = "large",
  style,
  icon = null,
}) {
  if (!count) return null;
  return (
    <Button type="link" size={size} style={style} icon={icon} onClick={onClick}>
      {label} ({count})
    </Button>
  );
}
