import React from "react";
import { Space, Typography } from "antd";
import { CrownOutlined, TeamOutlined } from "@ant-design/icons";
import s from "./SidebarBrand.module.scss";
import { useSidebarBrand } from "./logic";

const { Text } = Typography;

export default function SidebarBrand({ borderColor }) {
  const { brandText, brandColor, userRole } = useSidebarBrand();

  // Get icon based on role
  const getBrandIcon = () => {
    switch (userRole) {
      case "ADMIN":
        return <CrownOutlined className={s.icon} />;
      case "STAFF":
        return <TeamOutlined className={s.icon} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={s.brand}
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      <Space size={8} className={s.brandContent}>
        <span style={{ color: brandColor }}>{getBrandIcon()}</span>
        <Text strong className={s.brandText} style={{ color: brandColor }}>
          {brandText}
        </Text>
      </Space>
    </div>
  );
}
