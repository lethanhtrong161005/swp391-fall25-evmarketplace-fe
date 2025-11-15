
export function normalizeUserData(userData) {
  if (!userData || typeof userData !== "object") {
    return userData;
  }

  const normalized = { ...userData };

  // Normalize name fields
  if (userData.full_name && !userData.fullName) {
    normalized.fullName = userData.full_name;
  }
  if (userData.fullName && !userData.full_name) {
    normalized.full_name = userData.fullName;
  }

  // Normalize phone fields
  if (userData.phone_number && !userData.phoneNumber) {
    normalized.phoneNumber = userData.phone_number;
  }
  if (userData.phoneNumber && !userData.phone_number) {
    normalized.phone_number = userData.phoneNumber;
  }

  // Normalize avatar fields
  if (userData.avatar_url && !userData.avatarUrl) {
    normalized.avatarUrl = userData.avatar_url;
  }
  if (userData.avatarUrl && !userData.avatar_url) {
    normalized.avatar_url = userData.avatarUrl;
  }

  // Normalize date fields
  if (userData.created_at && !userData.createdAt) {
    normalized.createdAt = userData.created_at;
  }
  if (userData.createdAt && !userData.created_at) {
    normalized.created_at = userData.createdAt;
  }

  if (userData.updated_at && !userData.updatedAt) {
    normalized.updatedAt = userData.updated_at;
  }
  if (userData.updatedAt && !userData.updated_at) {
    normalized.updated_at = userData.updatedAt;
  }

  return normalized;
}

/**
 * Get display name with priority order
 */
export function getDisplayName(user) {
  if (!user) return "Người dùng";

  // Priority order: full_name > fullName > name > sub (non-phone) > role-based
  const candidates = [
    user.full_name,
    user.fullName,
    user.name,
    user.sub && !user.sub.startsWith("phone_") && !user.sub.match(/^\d+$/)
      ? user.sub
      : null,
  ].filter((name) => name?.trim());

  if (candidates.length > 0) {
    return candidates[0].trim();
  }

  // Role-based fallback
  const role = user.role?.toUpperCase();
  switch (role) {
    case "ADMIN":
      return "Quản trị viên";
    case "STAFF":
      return "Nhân viên";
    case "MEMBER":
      return "Thành viên";
    default:
      return "Người dùng";
  }
}

/**
 * Get display email/contact with priority order
 */
export function getDisplayContact(user) {
  if (!user) return "";

  // Priority order: email > phone_number > phoneNumber > role-based
  const candidates = [user.email, user.phone_number, user.phoneNumber].filter(
    (contact) => contact?.trim()
  );

  if (candidates.length > 0) {
    return candidates[0].trim();
  }

  // Role-based fallback
  const role = user.role?.toUpperCase();
  switch (role) {
    case "ADMIN":
      return "admin@reev.com";
    case "STAFF":
      return "staff@reev.com";
    default:
      return "user@reev.com";
  }
}

/**
 * Get avatar URL with priority order
 */
export function getAvatarUrl(user) {
  if (!user) return null;

  // Kiểm tra nhiều nguồn với thứ tự ưu tiên
  return (
    // Root level
    user.avatar_url ||
    user.avatarUrl ||
    user.avatar ||
    // Profile level (nested)
    user.profile?.profile?.avatarUrl ||
    user.profile?.profile?.avatar_url ||
    user.profile?.avatarUrl ||
    user.profile?.avatar_url ||
    user.profile?.avatar ||
    null
  );
}
