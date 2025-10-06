import { message } from "antd";
import {
  blockAccount,
  unblockAccount,
} from "@services/admin/account.admin.service";

export function useAccountTable({ onChanged }) {
  const [msg] = message.useMessage();

  const onChangeRole = async (row) => {
    if (row.role === "ADMIN") {
      return msg.warning("Không thể đổi vai trò Admin.");
    }

    // Role change API is not yet available in current backend
    msg.warning("Chức năng đổi vai trò chưa khả dụng trong phiên bản hiện tại");

    // TODO: Implement when backend provides role change API
    // Example: await changeAccountRole(row.id, role);
  };

  const onToggleLock = async (row) => {
    try {
      const isActive = row.status === "ACTIVE";

      if (isActive) {
        await blockAccount(row.id);
        msg.success(
          `Đã khóa tài khoản ${row.profile?.fullName || row.phoneNumber}`
        );
      } else {
        await unblockAccount(row.id);
        msg.success(
          `Đã mở khóa tài khoản ${row.profile?.fullName || row.phoneNumber}`
        );
      }

      // Refresh data to show updated status
      onChanged?.();
    } catch (error) {
      msg.error(
        error.message ||
          `Thao tác ${row.status === "ACTIVE" ? "khóa" : "mở khóa"} thất bại`
      );
    }
  };

  const onShowDetail = () => {
    // TODO: Implement view detail modal
    msg.info("Chức năng xem chi tiết đang được phát triển");
  };

  const onShowEdit = () => {
    // TODO: Implement edit modal
    msg.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const onViewLogs = async () => {
    try {
      msg.info("Chức năng xem nhật ký đang được phát triển");
    } catch (error) {
      msg.error(error.message || "Lỗi khi tải nhật ký");
    }
  };

  return {
    onChangeRole,
    onToggleLock,
    onShowDetail,
    onShowEdit,
    onViewLogs,
  };
}
