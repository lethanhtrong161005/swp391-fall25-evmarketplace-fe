import React from "react";
import { Menu } from "antd";
import { useStaffMenu } from "./logic";

export default function StaffMenu({ selected }) {
  const { menuItems, handleMenuClick } = useStaffMenu();

  return (
    <Menu
      mode="inline"
      selectedKeys={[selected]}
      onClick={handleMenuClick}
      style={{ background: "transparent", borderInlineEnd: 0, padding: 8 }}
      items={menuItems}
    />
  );
}
