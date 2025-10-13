import React from "react";
import { Button } from "antd";
import s from "./ActionButton.module.scss";

// Component nút thao tác tái sử dụng với thiết kế hiện đại
const ActionButton = ({
  variant = "secondary",
  size = "medium",
  disabled = false,
  icon,
  children,
  className = "",
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return s.primary;
      case "danger":
        return s.danger;
      case "success":
        return s.success;
      case "secondary":
      default:
        return s.secondary;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return s.small;
      case "large":
        return s.large;
      case "medium":
      default:
        return s.medium;
    }
  };

  return (
    <Button
      className={`${
        s.actionButton
      } ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={disabled}
      icon={icon}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
