import { useAuth } from "@hooks/useAuth";
import { Navigate } from "react-router-dom";
import Home from "@pages/Member/Home";

export default function HomeWrapper() {
  const { user } = useAuth();

  if (user?.role === "staff" || user?.role === "admin") {
    return <Navigate to="/staff" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Home />; // member hoặc guest
}
