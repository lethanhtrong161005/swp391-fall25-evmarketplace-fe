import { message } from "antd";
import {
  updateAccountRole,
  updateAccountStatus,
  getAccountActivityLogs,
} from "@services/accountService";
import { fakeAccountsData } from "../../../../data/admin/accountsData.fake";
const USE_FAKE_DATA = true;

export function useAccountTable({ onChanged }) {
  const [msg] = message.useMessage();

  const onChangeRole = async (row, role) => {
    if (row.role === "ADMIN") {
      return msg.warning("Không thể đổi vai trò Admin.");
    }
    if (USE_FAKE_DATA) {
      // mutate fake data
      const idx = fakeAccountsData.data.items.findIndex(
        (acc) => acc.id === row.id
      );
      if (idx !== -1) {
        fakeAccountsData.data.items[idx].role = role;
        msg.success(
          `Đã đổi vai trò thành ${
            role === "STAFF" ? "Nhân viên" : "Thành viên"
          }`
        );
        onChanged?.();
      }
      return;
    }
    try {
      await updateAccountRole(row.id, role);
      msg.success(
        `Đã đổi vai trò thành ${role === "STAFF" ? "Nhân viên" : "Thành viên"}`
      );
      onChanged?.();
    } catch (error) {
      msg.error(error.message || "Đổi vai trò thất bại");
    }
  };

  const onToggleLock = async (row) => {
    if (USE_FAKE_DATA) {
      const idx = fakeAccountsData.data.items.findIndex(
        (acc) => acc.id === row.id
      );
      if (idx !== -1) {
        const newStatus = row.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        fakeAccountsData.data.items[idx].status = newStatus;
        msg.success(
          newStatus === "SUSPENDED"
            ? "Đã khóa tài khoản"
            : "Đã mở khóa tài khoản"
        );
        onChanged?.();
      }
      return;
    }
    try {
      const newStatus = row.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      await updateAccountStatus(row.id, newStatus);
      if (newStatus === "SUSPENDED") {
        msg.success("Đã khóa tài khoản");
      } else {
        msg.success("Đã mở khóa tài khoản");
      }
      onChanged?.();
    } catch (error) {
      msg.error(error.message || "Thao tác thất bại");
    }
  };

  const onShowDetail = (row) => {
    // TODO: Implement view detail modal
    console.log("View detail for:", row);
    msg.info("Chức năng xem chi tiết đang được phát triển");
  };

  const onShowEdit = (row) => {
    // TODO: Implement edit modal
    console.log("Edit account:", row);
    msg.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const onViewLogs = async (row) => {
    try {
      const logs = await getAccountActivityLogs(row.id, {
        page: 1,
        pageSize: 10,
      });
      console.log("Activity logs for:", row.id, logs);
      msg.info("Xem nhật ký hoạt động (check console)");
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
