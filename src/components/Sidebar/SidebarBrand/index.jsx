import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@components/Logo/Logo";
import s from "./SidebarBrand.module.scss";

export default function SidebarBrand({ borderColor }) {
  const navigate = useNavigate();

  const handleBrandClick = () => {
    navigate("/");
  };

  return (
    <div
      className={s.brand}
      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
    >
      <div
        className={s.brandContent}
        style={{ cursor: "pointer" }}
        onClick={handleBrandClick}
      >
        <Logo variant="footer" onClick={null} />
      </div>
    </div>
  );
}
