import React, { useState } from "react";
import { Row, Col, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard";

const VehicleList = ({ listings, onClick }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // mỗi trang 8 sản phẩm

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

  // lọc ra sản phẩm là phương tiện
  const vehicles = listings.filter((listing) =>
    ["EV_CAR", "E_MOTORBIKE", "E_BIKE"].includes(
      listing.category?.toUpperCase()
    )
  );

  // tính toán sản phẩm của trang hiện tại
  const startIdx = (currentPage - 1) * pageSize;
  const currentData = vehicles.slice(startIdx, startIdx + pageSize);

  return (
    <>
      <Row gutter={[16, 16]} align="stretch">
        {currentData.map((listing) => (
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

      {/* Pagination */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={vehicles.length}
          onChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 cuộn lên đầu khi đổi trang
          }}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

export default VehicleList;
