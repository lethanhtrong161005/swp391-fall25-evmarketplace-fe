import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const getNotificationIcon = (type) => {
  switch (type) {
    case "LISTING_APPROVED":
      return "CheckCircleOutlined";
    case "LISTING_REJECTED":
      return "CloseCircleOutlined";
    case "LISTING_PENDING":
      return "ClockCircleOutlined";
    case "LISTING_EXPIRED":
      return "ExclamationCircleOutlined";
    case "LISTING_LIKED":
      return "HeartOutlined";
    default:
      return "BellOutlined";
  }
};

export const getNotificationColor = (type) => {
  switch (type) {
    case "LISTING_APPROVED":
      return "#52c41a";
    case "LISTING_REJECTED":
      return "#ff4d4f";
    case "LISTING_PENDING":
      return "#faad14";
    case "LISTING_EXPIRED":
      return "#fa8c16";
    case "LISTING_LIKED":
      return "#eb2f96";
    default:
      return "#1890ff";
  }
};

export const getNotificationTitle = (type) => {
  switch (type) {
    case "LISTING_APPROVED":
      return "Tin đăng được duyệt";
    case "LISTING_REJECTED":
      return "Tin đăng bị từ chối";
    case "LISTING_PENDING":
      return "Tin đăng chờ duyệt";
    case "LISTING_EXPIRED":
      return "Tin đăng sắp hết hạn";
    case "LISTING_LIKED":
      return "Tin đăng được yêu thích";
    default:
      return "Thông báo mới";
  }
};

export const formatNotificationTime = (createdAt) => {
  return dayjs(createdAt).fromNow();
};

export const formatNotificationDate = (createdAt) => {
  return dayjs(createdAt).format("DD/MM/YYYY HH:mm");
};

export const isNotificationRecent = (createdAt, minutes = 5) => {
  return dayjs().diff(dayjs(createdAt), "minute") <= minutes;
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
