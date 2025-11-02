import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  EyeOutlined,
  BellOutlined,
} from "@ant-design/icons";

export const getNotificationIcon = (type) => {
  const iconMap = {
    LISTING_APPROVED: CheckCircleOutlined,
    LISTING_REJECTED: CloseCircleOutlined,
    LISTING_PENDING: ClockCircleOutlined,
    LISTING_EXPIRED: ExclamationCircleOutlined,
    LISTING_LIKED: HeartOutlined,
    MESSAGE: EyeOutlined,
    PRICE_DROP: ExclamationCircleOutlined,
  };

  const IconComponent = iconMap[type] || BellOutlined;
  return <IconComponent style={{ color: "white", fontSize: "18px" }} />;
};

export const getNotificationColor = (type) => {
  const colorMap = {
    LISTING_APPROVED: "#52c41a",
    LISTING_REJECTED: "#ff4d4f",
    LISTING_PENDING: "#faad14",
    LISTING_EXPIRED: "#722ed1",
    LISTING_LIKED: "#eb2f96",
    MESSAGE: "#1890ff",
    PRICE_DROP: "#722ed1",
  };

  return colorMap[type] || "#1890ff";
};

export const getNotificationTitle = (type) => {
  const titleMap = {
    LISTING_APPROVED: "Tin đăng được duyệt",
    LISTING_REJECTED: "Tin đăng bị từ chối",
    LISTING_PENDING: "Tin đăng chờ duyệt",
    LISTING_EXPIRED: "Tin đăng sắp hết hạn",
    LISTING_LIKED: "Tin đăng được yêu thích",
    MESSAGE: "Tin nhắn mới",
    PRICE_DROP: "Xe bạn lưu đã giảm giá!",
  };

  return titleMap[type] || "Thông báo mới";
};

export const getNotificationPriority = (type) => {
  switch (type) {
    case "LISTING_REJECTED":
    case "LISTING_EXPIRED":
      return "high";
    case "LISTING_APPROVED":
    case "LISTING_LIKED":
      return "medium";
    case "LISTING_PENDING":
    default:
      return "low";
  }
};

export const shouldShowToast = (notification) => {
  const priority = getNotificationPriority(notification.type);
  return priority === "high" || priority === "medium";
};
