
export function normalizeUserData(userData) {
  if (!userData || typeof userData !== "object") {
    return userData;
  }

  const normalized = { ...userData };

  if (userData.full_name && !userData.fullName) {
    normalized.fullName = userData.full_name;
  }
  if (userData.fullName && !userData.full_name) {
    normalized.full_name = userData.fullName;
  }

  if (userData.phone_number && !userData.phoneNumber) {
    normalized.phoneNumber = userData.phone_number;
  }
  if (userData.phoneNumber && !userData.phone_number) {
    normalized.phone_number = userData.phoneNumber;
  }

  if (userData.avatar_url && !userData.avatarUrl) {
    normalized.avatarUrl = userData.avatar_url;
  }
  if (userData.avatarUrl && !userData.avatar_url) {
    normalized.avatar_url = userData.avatarUrl;
  }

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

export function getDisplayName(user) {
  if (!user) return "Người dùng";

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

export function getDisplayContact(user) {
  if (!user) return "";

  const candidates = [user.email, user.phone_number, user.phoneNumber].filter(
    (contact) => contact?.trim()
  );

  if (candidates.length > 0) {
    return candidates[0].trim();
  }

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

export function getAvatarUrl(user) {
  if (!user) return null;

  return (
    user.avatar_url ||
    user.avatarUrl ||
    user.profile?.avatar_url ||
    user.profile?.avatarUrl ||
    null
  );
}
