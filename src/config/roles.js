// Role constants và mapping tiếng Việt
export const ROLES = {
  MEMBER: "member",
  STAFF: "staff",
  MODERATOR: "moderator",
  INSPECTOR: "inspector",
  MANAGER: "manager",
  ADMIN: "admin",
};

// Mapping role sang tên tiếng Việt
export const ROLE_LABELS = {
  [ROLES.MEMBER]: "Thành viên",
  [ROLES.STAFF]: "Nhân viên",
  [ROLES.MODERATOR]: "Kiểm duyệt viên",
  [ROLES.INSPECTOR]: "Kỹ thuật viên",
  [ROLES.MANAGER]: "Quản lý",
  [ROLES.ADMIN]: "Quản trị viên",
};

// Role hierarchy (quyền hạn từ thấp đến cao)
export const ROLE_HIERARCHY = [
  ROLES.MEMBER,
  ROLES.STAFF,
  ROLES.MODERATOR,
  ROLES.INSPECTOR,
  ROLES.MANAGER,
  ROLES.ADMIN,
];

// Kiểm tra role có quyền truy cập dashboard không
export const hasDashboardAccess = (role) => {
  return [
    ROLES.STAFF,
    ROLES.MODERATOR,
    ROLES.INSPECTOR,
    ROLES.MANAGER,
    ROLES.ADMIN,
  ].includes(role);
};

// Lấy dashboard path theo role
export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.MANAGER:
      return "/manager";
    case ROLES.INSPECTOR:
      return "/inspector";
    case ROLES.MODERATOR:
      return "/moderator";
    case ROLES.STAFF:
      return "/staff";
    default:
      return null;
  }
};

// Kiểm tra role có quyền quản lý không
export const hasManagementAccess = (role) => {
  return [ROLES.MANAGER, ROLES.ADMIN].includes(role);
};
