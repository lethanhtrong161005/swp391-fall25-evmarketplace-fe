import { useAuth } from "@hooks/useAuth";
import Home from "@pages/Member/Home";

export default function HomeWrapper() {
  const { user } = useAuth();

  // Hiển thị trang chủ cho tất cả người dùng (member, staff, admin, guest)
  // Admin/Staff có thể truy cập dashboard qua menu Profile
  return <Home />;
}
