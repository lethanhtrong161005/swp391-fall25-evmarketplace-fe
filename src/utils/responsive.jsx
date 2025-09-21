import { Grid } from "antd";

const { useBreakpoint } = Grid;

// Định nghĩa breakpoints theo Ant Design
export const BREAKPOINTS = {
  xs: 480,
  sm: 576, 
  md: 768, 
  lg: 992, 
  xl: 1200, 
  xxl: 1600, 
};

// Device types
export const DEVICE_TYPES = {
  MOBILE: "mobile",
  TABLET: "tablet",
  LAPTOP: "laptop",
  DESKTOP: "desktop",
};

// Hook để sử dụng responsive breakpoints
export const useResponsive = () => {
  const screens = useBreakpoint();

  const getDeviceType = () => {
    if (!screens.md) return DEVICE_TYPES.MOBILE; // < 768px
    if (screens.md && !screens.lg) return DEVICE_TYPES.TABLET; // 768px - 991px
    if (screens.lg && !screens.xl) return DEVICE_TYPES.LAPTOP; // 992px - 1199px
    return DEVICE_TYPES.DESKTOP; // >= 1200px
  };

  const deviceType = getDeviceType();

  return {
    screens,
    deviceType,
    isMobile: deviceType === DEVICE_TYPES.MOBILE,
    isTablet: deviceType === DEVICE_TYPES.TABLET,
    isLaptop: deviceType === DEVICE_TYPES.LAPTOP,
    isDesktop: deviceType === DEVICE_TYPES.DESKTOP,

    isMinTablet: screens.md, 
    isMinLaptop: screens.lg, 
    isMinDesktop: screens.xl, 
  };
};

export const getResponsiveValue = (values, deviceType) => {
  const { mobile, tablet, laptop, desktop } = values;

  switch (deviceType) {
    case DEVICE_TYPES.MOBILE:
      return mobile;
    case DEVICE_TYPES.TABLET:
      return tablet || mobile;
    case DEVICE_TYPES.LAPTOP:
      return laptop || tablet || mobile;
    case DEVICE_TYPES.DESKTOP:
      return desktop || laptop || tablet || mobile;
    default:
      return mobile;
  }
};

export const getLogoSize = (deviceType) => {
  return getResponsiveValue(
    {
      mobile: 40,
      tablet: 48,
      laptop: 56,
      desktop: 64,
    },
    deviceType
  );
};

export const getHeaderPadding = (deviceType) => {
  return getResponsiveValue(
    {
      mobile: "0 12px",
      tablet: "0 20px",
      laptop: "0 32px",
      desktop: "0 48px",
    },
    deviceType
  );
};

export const getElementGap = (deviceType) => {
  return getResponsiveValue(
    {
      mobile: 12,
      tablet: 16,
      laptop: 20,
      desktop: 24,
    },
    deviceType
  );
};

export const getSearchWidth = (deviceType) => {
  return getResponsiveValue(
    {
      mobile: "100%",
      tablet: "200px",
      laptop: "250px", 
      desktop: "280px", 
    },
    deviceType
  );
};

export const getNavbarColSpans = (deviceType) => {
  switch (deviceType) {
    case DEVICE_TYPES.MOBILE:
      return {
        logo: { span: 24 }, 
        search: { span: 24 }, 
        menu: { span: 0 }, 
        actions: { span: 0 }, 
      };
    case DEVICE_TYPES.TABLET:
      return {
        logo: { span: 7 }, 
        search: { span: 11 }, 
        menu: { span: 0 }, 
        actions: { span: 6 },
      };
    case DEVICE_TYPES.LAPTOP:
      return {
        logo: { span: 3 }, 
        search: { span: 4 },  
        menu: { span: 13 }, 
        actions: { span: 4 },
      };
    case DEVICE_TYPES.DESKTOP:
      return {
        logo: { span: 2 },
        search: { span: 4 },
        menu: { span: 14 }, 
        actions: { span: 4 },
      };
    default:
      return {
        logo: { span: 16 },
        search: { span: 24 },
        menu: { span: 0 },
        actions: { span: 8 },
      };
  }
};

// Export default hook
export default useResponsive;
