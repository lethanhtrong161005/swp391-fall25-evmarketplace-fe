import React from "react";

export default function SidebarBrand({ borderColor }) {
  return (
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        paddingInline: 16,
        fontWeight: 700,
        fontSize: 18,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      ReEV Admin
    </div>
  );
}
