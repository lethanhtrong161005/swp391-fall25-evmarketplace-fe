import React from "react";
import { Row, Col } from "antd";
import ProductCard from "../../../components/ProductCard/ProductCard";

const VehicleList = ({ vehicles }) => {
  return (
    <Row gutter={[16, 16]} align="stretch">
      {vehicles.map((vehicle) => (
        <Col
          key={vehicle.id}
          xs={24}
          sm={12}
          md={8}
          lg={6} // 4 cột mỗi hàng
        >
          <ProductCard listing={vehicle} style={{ height: "100%" }} />
        </Col>
      ))}
    </Row>
  );
};

export default VehicleList;
