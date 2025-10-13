import { useRoutes } from "react-router-dom";
import { routes } from "@routes";
import ScrollToTop from "./components/ScrollTop/ScrollTop";

const App = () => {
  const element = useRoutes(routes()); 

  return (
    <>
      <ScrollToTop /> 
      {element}
    </>
  );
};

export default App;
