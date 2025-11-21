import { useAuth } from "@hooks/useAuth";
import { theme } from "antd";

export function useSidebarBrand() {
  const { user } = useAuth();
  const { token } = theme.useToken();

  const role = user?.role ? String(user.role).toUpperCase() : null;

  const getBrandText = () => {
    // switch (role) {
    //   case "ADMIN":
    //     return "ReEV Admin";
    //   case "MODERATOR":
    //     return "ReEV Moderator";
    //   default:
    //     return "ReEV Staff";
    // }
    return "ReEV"
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
