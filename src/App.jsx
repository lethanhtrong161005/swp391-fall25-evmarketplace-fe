import { useRoutes } from "react-router-dom";
import { routes } from "@routes";
import ScrollToTop from "./components/ScrollTop/ScrollTop";

const App = () => {
  const element = useRoutes(routes()); // ✅ đặt bên ngoài JSX

  return (
    <>
      <ScrollToTop /> {/* ✅ chạy scroll mỗi khi đổi route */}
      {element} {/* ✅ render routes */}
    </>
  );
};

export default App;
