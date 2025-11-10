import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { App as AntApp } from "antd";
import ScrollToTop from "@components/ScrollTop/ScrollTop";
import { routes } from "./routes";
import { Spin } from "antd";

const App = () => {
  const element = useRoutes(routes());

  return (
    <AntApp>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Spin size="large" />
          </div>
        }
      >
        {element}
      </Suspense>
    </AntApp>
  );
};

export default App;
