import { ROLES } from "@config/roles";

export const canEditAccount = (currentUser, targetAccount) => {
  if (!currentUser || !targetAccount) return false;

  if (targetAccount.role === ROLES.ADMIN) {
    return currentUser.phoneNumber === targetAccount.phoneNumber;
  }

  return [ROLES.ADMIN, ROLES.MANAGER].includes(currentUser.role);
};

export const canLockAccount = (currentUser, targetAccount) => {
  if (!currentUser || !targetAccount) return false;

  if (currentUser.phoneNumber === targetAccount.phoneNumber) {
    return false;
  }

  if (targetAccount.role === ROLES.ADMIN) {
    return false;
  }

  return [ROLES.ADMIN, ROLES.MANAGER].includes(currentUser.role);
};

export const canChangeRole = (currentUser, targetAccount) => {
  if (!currentUser || !targetAccount) return false;

  if (currentUser.role !== ROLES.ADMIN) {
    return false;
  }

  if (currentUser.phoneNumber === targetAccount.phoneNumber) {
    return false;
  }

  if (targetAccount.role === ROLES.ADMIN) {
    return false;
  }

  return true;
};

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
