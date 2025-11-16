import React from "react";
import { useNavigate } from "react-router-dom";
import ReEVLogo from "@components/Icons/ReEVLogo";
import styles from "./Logo.module.scss";

const Logo = ({ variant = "header", className = "", onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick === null) {
      return;
    }
    if (onClick) {
      onClick();
    } else {
      navigate("/");
    }
  };

  const logoClassName = `${styles.logo} ${styles[variant]} ${className}`.trim();
  const isClickable = onClick !== null;

  const logoVariant = variant === "footer" ? "light" : "dark";
  const textColor = variant === "footer" ? "#FFFFFF" : "#1B2A41";

  return (
    <div
      className={logoClassName}
      onClick={isClickable ? handleClick : undefined}
      style={{ cursor: isClickable ? "pointer" : "default" }}
    >
      <ReEVLogo variant={logoVariant} className={styles.logoIcon} />
      <h2 className={styles.brandName} style={{ color: textColor }}>
        ReEV
      </h2>
    </div>
  );
};

export default Logo;
