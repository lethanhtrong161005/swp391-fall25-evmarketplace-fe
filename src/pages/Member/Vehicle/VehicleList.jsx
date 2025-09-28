import React from "react";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard";

const VehicleList = ({ listings, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (listing) => {
    if (onClick) {
      onClick(listing);
    } else if (listing?.id) {
      let type = "vehicle"; // mặc định

      const cat = listing.category?.toUpperCase();
      if (cat === "BATTERY") {
        type = "battery";
      } else if (
        cat === "EV_CAR" ||
        cat === "E_MOTORBIKE" ||
        cat === "E_BIKE"
      ) {
        type = "vehicle";
      } else {
        console.warn("⚠️ Category không xác định:", cat);
      }

      navigate(`/detail/${type}/${listing.id}`);
    }
  };
  return (
    <Row gutter={[16, 16]} align="stretch">
      {listings
        .filter((listing) =>
          ["EV_CAR", "E_MOTORBIKE", "E_BIKE"].includes(
            listing.category?.toUpperCase()
          )
        )
        .map((listing) => (
          <Col
            key={listing.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6} // 4 cột mỗi hàng
          >
            <ProductCard
              listing={listing}
              onClick={() => handleClick(listing)}
              style={{ height: "100%" }}
            />
          </Col>
        ))}
    </Row>
  );
};

export default VehicleList;
