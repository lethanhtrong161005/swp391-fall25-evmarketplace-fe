import { useRoutes } from "react-router-dom";
import { App as AntApp } from "antd";
import { routes } from "@routes";
import ScrollToTop from "./components/ScrollTop/ScrollTop";

const App = () => {
  const element = useRoutes(routes());

  return (
    <AntApp>
      <ScrollToTop />
      {element}
    </AntApp>
  );
};

export default App;
