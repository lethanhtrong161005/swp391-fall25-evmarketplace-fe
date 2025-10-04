import { useAuth } from "@hooks/useAuth";
import { theme } from "antd";

export function useSidebarBrand() {
  const { user } = useAuth();
  const { token } = theme.useToken();

  // Since this page is only for Admin and Staff roles (access already controlled)
  const role = user?.role ? String(user.role).toUpperCase() : null;

  // Simple brand text - only Admin or Staff
  const getBrandText = () => {
    return role === "ADMIN" ? "ReEV Admin" : "ReEV Staff";
  };

  // Simple color scheme - Red for Admin, Primary Blue for Staff
  const getBrandColor = () => {
    return role === "ADMIN" ? token.colorError : token.colorPrimary;
  };

  return {
    brandText: getBrandText(),
    brandColor: getBrandColor(),
    userRole: role,
  };
}
