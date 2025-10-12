import { ROLES } from "@config/roles";

// Utility functions để kiểm tra quyền hạn trong Account Management

// Kiểm tra quyền chỉnh sửa account
export const canEditAccount = (currentUser, targetAccount) => {
  if (!currentUser || !targetAccount) return false;

  // Admin chỉ có thể sửa profile của chính mình
  if (targetAccount.role === ROLES.ADMIN) {
    return currentUser.phoneNumber === targetAccount.phoneNumber;
  }

  // Các role khác có thể được chỉnh sửa bởi Admin/Manager
  return [ROLES.ADMIN, ROLES.MANAGER].includes(currentUser.role);
};

// Kiểm tra quyền khóa/mở khóa account
export const canLockAccount = (currentUser, targetAccount) => {
  if (!currentUser || !targetAccount) return false;

  // Không thể khóa chính mình
  if (currentUser.phoneNumber === targetAccount.phoneNumber) {
    return false;
  }

  // Admin không thể bị khóa bởi ai khác
  if (targetAccount.role === ROLES.ADMIN) {
    return false;
  }

  // Admin và Manager có thể khóa các account khác
  return [ROLES.ADMIN, ROLES.MANAGER].includes(currentUser.role);
};

// Kiểm tra quyền đổi role account
export const canChangeRole = (currentUser, targetAccount) => {
  if (!currentUser || !targetAccount) return false;

  // Chỉ Admin mới có thể đổi role
  if (currentUser.role !== ROLES.ADMIN) {
    return false;
  }

  // Không thể đổi role của chính mình
  if (currentUser.phoneNumber === targetAccount.phoneNumber) {
    return false;
  }

  // Không thể đổi role của Admin khác
  if (targetAccount.role === ROLES.ADMIN) {
    return false;
  }

  return true;
};

// Lấy tooltip message cho action buttons
export const getActionTooltip = (action, currentUser, targetAccount) => {
  const isOwnAccount = currentUser?.phoneNumber === targetAccount?.phoneNumber;

  switch (action) {
    case "edit":
      if (targetAccount?.role === ROLES.ADMIN) {
        return isOwnAccount
          ? "Chỉnh sửa thông tin cá nhân của tôi"
          : "Không thể chỉnh sửa tài khoản Admin khác (Bảo mật)";
      }
      return "Chỉnh sửa thông tin tài khoản";

    case "lock":
      if (isOwnAccount) {
        return "Không thể khóa chính mình";
      }
      if (targetAccount?.role === ROLES.ADMIN) {
        return "Không thể khóa tài khoản Admin";
      }
      return "Khóa/Mở khóa tài khoản";

    case "changeRole":
      if (isOwnAccount) {
        return "Không thể đổi role của chính mình";
      }
      if (targetAccount?.role === ROLES.ADMIN) {
        return "Không thể đổi role của Admin";
      }
      return "Đổi vai trò tài khoản";

    default:
      return "";
  }
};
