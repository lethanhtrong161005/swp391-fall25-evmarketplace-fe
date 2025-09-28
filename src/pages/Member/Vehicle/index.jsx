import React from "react";
import { Row, Col } from "antd";
import VehicleList from "./VehicleList";
import vehiclesData from "../../../data/ProductsData";
const Vehicle = () => {
  return (
    <div style={{ minHeight: "100vh"}}>
      <main style={{ padding: "40px 40px", width:"maxWidth", margin: "0 auto" }}>
        <VehicleList listings={vehiclesData} />
      </main>
    </div>
  );
};

export default Vehicle;
