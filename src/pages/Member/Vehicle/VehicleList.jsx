import React, { useState } from "react";
import { Empty } from "antd";
import styles from "../Home/LatestListingsSection.module.scss";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard";

const VehicleList = ({ listings, onClick }) => {
  const navigate = useNavigate();
  const pageSize = 20; // hiển thị tối đa 20 sản phẩm mới nhất

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
        console.warn("Category không xác định:", cat);
      }

      navigate(`/detail/${type}/${listing.id}`);
    }
  };

  // lọc ra sản phẩm là phương tiện và ACTIVE
  const vehicles = listings.filter(
    (listing) =>
      ["EV_CAR", "E_MOTORBIKE", "E_BIKE"].includes(
        listing.category?.toUpperCase()
      ) && listing.status?.toUpperCase() === "ACTIVE"
  );

  // lấy tối đa 20 sản phẩm mới nhất (giả định danh sách đã sort theo createdAt desc từ API)
  const currentData = vehicles.slice(0, pageSize);

  return (
    <>
      {vehicles.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Empty description="Không có sản phẩm nào được tìm thấy" />
        </div>
      ) : (
        <div className={styles.grid5x}>
          {currentData.map((listing) => (
            <div key={listing.id} className={styles.gridItem}>
              <ProductCard
                listing={listing}
                onClick={() => handleClick(listing)}
                style={{ height: "100%" }}
                showVerifiedTag={false}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default VehicleList;
