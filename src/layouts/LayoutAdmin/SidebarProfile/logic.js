export function useSidebarProfile(user) {
  const displayName =
    user?.profile?.fullName ||
    user?.name ||
    user?.sub ||
    user?.phoneNumber ||
    "Admin User";
  const displayEmail = user?.email || user?.phoneNumber || "admin@reev.com";

  return {
    displayName,
    displayEmail,
  };
}
