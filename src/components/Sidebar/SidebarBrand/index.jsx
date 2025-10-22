import React from "react";
import { Space, Typography } from "antd";
import { CrownOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import s from "./SidebarBrand.module.scss";
import { useSidebarBrand } from "./logic";

const { Text } = Typography;

export default function SidebarBrand({ borderColor }) {
  const navigate = useNavigate();
  const { brandText, brandColor, userRole } = useSidebarBrand();

  const handleBrandClick = () => {
    // Navigate to appropriate home page based on role
    if (userRole === "ADMIN") {
      navigate("/admin");
    } else if (userRole === "STAFF") {
      navigate("/staff");
    } else if (userRole === "MODERATOR") {
      navigate("/moderator");
    } else {
      navigate("/");
    }
  };

  // Get icon based on role
  const getBrandIcon = () => {
    switch (userRole) {
      case "ADMIN":
        return <CrownOutlined className={s.icon} />;
      case "STAFF":
        return <TeamOutlined className={s.icon} />;
      case "MODERATOR":
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
      <Space
        size={8}
        className={s.brandContent}
        style={{ cursor: "pointer" }}
        onClick={handleBrandClick}
      >
        <span style={{ color: brandColor }}>{getBrandIcon()}</span>
        <Text strong className={s.brandText} style={{ color: brandColor }}>
          {brandText}
        </Text>
      </Space>
    </div>
  );
}
