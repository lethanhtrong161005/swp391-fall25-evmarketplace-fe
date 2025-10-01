// src/pages/Staff/StaffListingManagement/StaffListingManagement.actions.js
import { message } from "antd";

export const handleAccept = (id, updateStatus) => {
  updateStatus(id, "ACTIVE");
  message.success("Bài đăng đã được chuyển sang trạng thái Đã đăng");
};

export const handleReject = (id, updateStatus) => {
  updateStatus(id, "REJECTED");
  message.error("Bài đăng đã bị từ chối");
};

export const handleWaitPayment = (id, updateStatus) => {
  updateStatus(id, "APPROVED");
  message.info("Bài đăng đã được kiểm duyệt, chờ thanh toán");
};

export const handleUndo = (id, updateStatus) => {
  updateStatus(id, "PENDING");
  message.info("Bài đăng đã được hoàn tác về trạng thái Chờ xét duyệt");
};
