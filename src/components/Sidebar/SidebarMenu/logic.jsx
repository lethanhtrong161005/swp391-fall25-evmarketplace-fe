import React from "react";

export function useSidebarMenu(token) {
  const menuConfig = {
    itemHeight: 42,
    itemMarginBlock: 6,
    itemMarginInline: 8,
    itemBorderRadius: 10, // pill
    itemPaddingInline: 12,
    itemColor: token?.colorText,
    itemHoverColor: token?.colorText,
    itemHoverBg: token?.colorFillTertiary,
    itemSelectedColor: token?.colorTextLightSolid, // white text on primary
    itemSelectedBg: token?.colorPrimary,
    itemActiveBg: token?.colorPrimary,
    itemActiveColor: token?.colorTextLightSolid,
    fontSize: 14,
  };

  return {
    menuConfig,
  };
}
