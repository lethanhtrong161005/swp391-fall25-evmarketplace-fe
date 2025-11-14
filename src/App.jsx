import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { App as AntApp, Spin } from "antd";
import ScrollToTop from "@components/ScrollTop/ScrollTop";
import { routes } from "./routes";

const App = () => {
  const element = useRoutes(routes());

  return (
    <AntApp>
      <ScrollToTop />
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100vw",
            }}
          >
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
