import React from "react";

export function useSidebarMenu(token) {
  const menuConfig = {
    itemHeight: 42,
    itemMarginBlock: 6,
    itemMarginInline: 8,
    itemBorderRadius: 10, // pill
    itemPaddingInline: 12,
    itemColor: "#ffffff", // Màu trắng cho text và icon trên nền primary
    itemHoverColor: "#ffffff",
    itemHoverBg: "rgba(255, 255, 255, 0.2)", // Hover effect rõ hơn
    itemSelectedColor: "#ffffff", // white text on selected
    itemSelectedBg: "rgba(255, 255, 255, 0.3)", // Selected background sáng hơn
    itemActiveBg: "rgba(255, 255, 255, 0.3)",
    itemActiveColor: "#ffffff",
    fontSize: 14,
    fontWeight: 500, // Tăng độ đậm của text để nổi bật hơn
    iconSize: 18, // Tăng kích thước icon
    subMenuItemBg: "transparent",
    // Thêm style cho submenu items
    subMenuItemColor: "#ffffff",
    subMenuItemSelectedColor: "#ffffff",
    subMenuItemSelectedBg: "rgba(255, 255, 255, 0.3)",
    subMenuItemHoverBg: "rgba(255, 255, 255, 0.15)",
  };

  return {
    menuConfig,
  };
}
