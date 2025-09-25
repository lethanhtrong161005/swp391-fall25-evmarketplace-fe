import React from "react";
import { Row, Col } from "antd";
import ProductCard from "../../../components/ProductCard/ProductCard";

const BatteryList = ({ batteries }) => {
  return (
    <Row gutter={[16, 16]} align={"stretch"}>
      {batteries.map((battery) => (
        <Col
          key={battery.id}
          xs={24}
          sm={12}
          md={8}
          lg={6} // 4 cột mỗi hàng
        >
          <ProductCard listing={battery} style={{ height: "100%" }} />
        </Col>
      ))}
    </Row>
  );
};

export default BatteryList;
