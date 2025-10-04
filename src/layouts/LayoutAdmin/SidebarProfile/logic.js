export function useSidebarProfile(user) {
  const displayName = user?.name || user?.sub || "Admin User";
  const displayEmail = user?.email || "admin@reev.com";

  return {
    displayName,
    displayEmail,
  };
}
