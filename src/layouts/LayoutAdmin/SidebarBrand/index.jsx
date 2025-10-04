import React from "react";
import s from "./SidebarBrand.module.scss";
import { useSidebarBrand } from "./logic";

export default function SidebarBrand({ borderColor }) {
  const { brandText } = useSidebarBrand();

  return (
    <div
      className={s.brand}
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      {brandText}
    </div>
  );
}
